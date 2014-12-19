<?php

/**
 * Copyright (C) 2013-2014 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

require_once "openmediavault/config.inc";
require_once "openmediavault/error.inc";
require_once "openmediavault/initscript.inc";
require_once "openmediavault/notify.inc";
require_once "openmediavault/object.inc";
require_once "openmediavault/rpcservice.inc";
require_once "openmediavault/util.inc";

class OMVRpcServiceWscan extends OMVRpcServiceAbstract
{
    const
        COUNTRY_LIST   = "c",
        SATELLITE_LIST = "s";

    const
        WSCAN_ATSC = "a",
        WSCAN_CABLE = "c",
        WSCAN_SATELLITE = "s",
        WSCAN_TERRESTIAL = "t";

    public function getName()
    {
        return "Wscan";
    }

    public function initialize()
    {
        $this->registerMethod("enumerateCountries");
        $this->registerMethod("enumerateSatellites");
        $this->registerMethod("scan");
        $this->registerMethod("scanInProgress");
    }

    public function enumerateCountries($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        return $this->getWscanList(self::COUNTRY_LIST);
    }

    public function enumerateSatellites($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        return $this->getWscanList(self::SATELLITE_LIST);
    }

    /**
     * Perform a channel scan.
     *
     * @return void
     */
    public function scan($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        $this->validateMethodParams(
            $params,
            '{
                "type": "object",
                "properties": {
                    "frontend_type": { "type": "string", "enum": ["a", "c", "s", "t"] },
                    "include_radio_channels": { "type": "boolean" },
                    "include_tv_channels": { "type": "boolean" },
                    "include_other_services": { "type": "boolean" },
                    "include_encrypted_channels": { "type": "boolean" },
                    "country": { "type": "string" }

                    "atsc_type": { "type": "integer", "minimum": 1, "maximum": 3, "optional": true },
                    "dvb_c_modulation": { "type": "integer", "minimum": 0, "maximum": 2, "optional": true },
                    "dvb_c_symbol_rate": { "type": "integer", "minimum": 0, "maximum": 17, "optional": true},
                    "dvb_c_extended_qam": { "type": "boolean", "optional": true },
                    "dvb_s_satellite": { "type": "string", "optional": true },
                }
            }'
        );

        // Check if scan is active. If active or checking failed return.
        if ($this->scanInProgress(array(), $context)) {
            return;
        }

        // Create a background process.
        $bgStatusFilename = $this->createBgProcStatus();
        $pid = $this->fork();

        if ($pid > 0) {
            $this->initializeBgProcStatus($bgStatusFilename, $pid);
            return $bgStatusFilename;
        }

        try {
            $bgOutputFilename = $this->createBgProcOutput();

            $this->updateBgProcStatus(
                $bgStatusFilename,
                "outputfilename",
                $bgOutputFilename
            );

            $optional = [];

            if (!empty($params["atsc_type"])) {
                $optional["atscType"] = $params["atsc_type"];
            }

            if (!empty($params["dvb_c_modulation"])) {
                $optional["dvbcModulation"] = $params["dvb_c_modulation"];
            }

            if (!empty($params["dvb_c_symbol_rate"])) {
                $optional["dvbcSymbolRate"] = $params["dvb_c_symbol_rate"];
            }

            if (!empty($params["dvb_c_extended_qam"])) {
                $optional["dvbcExtendedQam"] = $params["dvb_c_extended_qam"];
            }

            if (!empty($params["dvb_s_satellite"])) {
                $optional["dvbsSatellite"] = $params["dvb_s_satellite"];
            }

            $wscanCmd = $this->getWscanCommand(
                $params["frontend_type"],
                $params["include_radio_channels"],
                $params["include_tv_channels"],
                $params["include_other_services"],
                $params["include_encrypted_channels"],
                $params["country"],
                $optional
            );

            // Redirect stderr to $bgOutputFilename because of the behaviour
            // of w_scan.
            $cmd = sprintf(
                "export LANG=C; %s > %s 2>%s",
                $wscanCmd,
                $this->tempChannelFileLocation,
                $bgOutputFilename
            );

            if (0 === $this->exec($cmd, $output)) {
                // Append channel.conf data to real file
                // and remove the temporary.
                $cmd = sprintf(
                    "export LANG=C; cat %1\$s > %2\$s; rm %1\$s",
                    $this->tempChannelFileLocation,
                    $this->channelFileLocation
                );

                if (0 !== $this->exec($cmd, $output)) {
                    throw new OMVException(
                        OMVErrorMsg::E_EXEC_FAILED,
                        $cmd,
                        implode("\n", $output)
                    );
                }
            }

            $this->finalizeBgProcStatus($bgStatusFilename, $output);
            exit(0);
        } catch (\Exception $e) {
            $this->finalizeBgProcStatus($bgStatusFilename, "", $e);
            exit(1);
        }
    }

    /**
     * Check if w_scan in running.
     *
     * @return boolean
     */
    public function scanInProgress($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        $cmd = "export LANG=C; pgrep -n w_scan 2>&1";
        $pgrepReturn = $this->exec($cmd, $output);

        if ($pgrepReturn === 0) {
            return true;
        } elseif ($pgrepReturn === 1) {
            return false;
        } else {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode("\n", $output)
            );
        }
    }

    private function buildWscanCommand(
        $frontendType,
        $includeRadioChannels,
        $includeTvChannels,
        $includeOtherServices,
        $includeEncryptedChannels,
        $country,
        $optional = []
    ) {
        $args = [];
        $cmd = "";

        // VDR version is >= 1.7.
        $args["o"] = 7;

        $args["f"] = $frontendType;

        // Set which services to include.
        if ($includeRadioChannels) {
            $args["R"] = $includeRadioChannels ? 1 : 0;
        }

        if ($includeTvChannels) {
            $args["T"] = $includeTvChannels ? 1 : 0;
        }

        if ($includeOtherServices) {
            $args["O"] = $includeOtherServices ? 1 : 0;
        }

        if ($includeEncryptedChannels) {
            $args["E"] = $includeEncryptedChannels ? 1 : 0;
        }

        $args["c"] = $country;

        // Frontend specific options.
        if ($frontendType === self::WSCAN_ATSC) {
            $args["A"] = $optional["atscType"];
        }

        if ($frontendType === self::WSCAN_CABLE) {
            if (!empty($optional["dvbcModulation"])) {
                $args["Q"] = $optional["dvbcModulation"];
            }

            if (!empty($optional["dvbcSymbolRate"])) {
                $args["S"] = $optional["dvbcSymbolRate"];
            }

            if (!emtpy($optional["dvbcExtendedQam"])) {
                $args["e"] = 2;
            }
        }

        if ($frontendType === self::WSCAN_SATELLITE) {
            $args["s"] = $optional["dvbsSatellite"];
        }

        $parameters = [];

        foreach ($args as $argumentKey => $argumentValue) {
            $parameters[] = "$argumentKey $argumentValue";
        }

        return sprintf("w_scan %s", implode(" ", $parameters));
    }

    private function getWscanList($type)
    {
        $cmd = sprintf("export LANG=C; w_scan -%s? 2>&1", $type);

        if (0 !== $this->exec($cmd, $output)) {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode("\n", $output)
            );
        }

        $list = array();

        foreach ($output as $row) {
            $row = trim($row);
            $data = preg_split("/\s+/", $row);

            $entry = [];

            $entry["abbr"] = $data[0];

            if (self::COUNTRY_LIST === $type) {
                $entry["country"] = $data[1];
            }

            if (self::SATELLITE_LIST === $type) {
                $entry["satellite"] = $data[1];
            }

            $list[] = $entry;
        }

        return $list;
    }
}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServiceWscan());