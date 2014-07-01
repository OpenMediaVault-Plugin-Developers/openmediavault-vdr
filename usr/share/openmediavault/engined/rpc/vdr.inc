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

class OMVRpcServiceVdr extends OMVRpcServiceAbstract
{
    const COUNTRY_LIST   = "c",
          SATELLITE_LIST = "s";

    const WSCAN_ATSC = "a",
          WSCAN_CABLE = "c",
          WSCAN_SATELLITE = "s",
          WSCAN_TERRESTIAL = "t";

    private $channelFileLocation = "/var/lib/vdr/channels.conf";
    private $tempChannelFileLocation = "/tmp/channels.conf";

    private function getEventMessagePath()
    {
        return "org.openmediavault.services.vdr";
    }

    private function getXPath()
    {
        return "//services/vdr";
    }

    private function getWscanXPath()
    {
        return sprintf("%s/w_scan", $this->getXPath());
    }

    public function getName()
    {
        return "VDR";
    }

    public function initialize()
    {
        $this->registerMethod("getSettings");
        $this->registerMethod("setSettings");
        $this->registerMethod("vdrIsRunning");
        $this->registerMethod("getScanSettings");
        $this->registerMethod("setScanSettings");
        $this->registerMethod("executeChannelScan");
        $this->registerMethod("scanInProgress");
        $this->registerMethod("getChannels");
        $this->registerMethod("setChannels");
        $this->registerMethod("checkDevices");
        $this->registerMethod("enumerateCountries");
        $this->registerMethod("enumerateSatellites");
    }

    public function getSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        // Get the configuration object.
        $object = $xmlConfig->get($this->getXPath());

        if (is_null($object)) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $this->getXPath());
        }

        // Modify the result object
        $object["vdr_enable"]         = boolval($object["vdr_enable"]);
        $object["vdr_logging_on"]     = boolval($object["vdr_logging_on"]);
        $object["vdr_maxfilesize_gb"] = intval($object["vdr_maxfilesize_gb"]);
        $object["vdr_subtitles"]      = boolval($object["vdr_subtitles"]);

        // Streamdev
        $object["vdr_streamdev_enable"] = boolval($object["vdr_streamdev_enable"]);
        $object["vdr_streamdev_port"]   = intval($object["vdr_streamdev_port"]);

        // Live
        $object["vdr_live_enable"] = boolval($object["vdr_live_enable"]);
        $object["vdr_live_port"]   = intval($object["vdr_live_port"]);

        // VdrAdmin
        $object["vdradminam_enable"] = boolval($object["vdradminam_enable"]);
        $object["vdradminam_port"]   = intval($object["vdradminam_port"]);

        unset($object["w_scan"]);

        return $object;
    }

    public function setSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        $this->validateMethodParams(
            $params,
            '{
                "type"       : "object",
                "properties" : {
                    "vdr_enable"             : { "type" : "boolean" },
                    "vdr_logging_on"         : { "type" : "boolean" },
                    "vdr_recordingdir"       : { "type" : "string" },
                    "vdr_maxfilesize_gb"     : { "type" : "integer", "minimum" : 1 },
                    "vdr_subtitles"          : { "type" : "boolean" },
                    "vdr_subtitle_languages" : { "type" : "string" },
                    "vdr_epglanguage"        : { "type" : "string" },
                    "vdr_channelupdatemode"  : { "type" : "number", "minimum" : 0, "maximum" : 6 },

                    "vdr_streamdev_enable" : { "type" : "boolean" },
                    "vdr_streamdev_port"   : { "type" : "integer", "minimum" : 1, "maximum" : 65535 },
                    "vdr_streamdev_hosts"  : { "type" : "string" },

                    "vdr_live_enable" : { "type" : "boolean" },
                    "vdr_live_port"   : { "type" : "integer", "minimum" : 1, "maximum" : 65535 },

                    "vdradminam_enable" : { "type" : "boolean" },
                    "vdradminam_port"   : { "type" : "integer", "minimum" : 1, "maximum" : 65535 }
                }
            }'
        );

        // Get the existing configuration object.
        $oldObject = $xmlConfig->get($this->getXPath());

        if (is_null($oldObject)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXPath()
            );
        }

        // Update the configuration object.
        $object = array(
            // Vdr
            "vdr_enable"             => array_boolval($params, 'vdr_enable'),
            "vdr_logging_on"         => array_boolval($params, 'vdr_logging_on'),
            "vdr_recordingdir"       => $params['vdr_recordingdir'],
            "vdr_maxfilesize_gb"     => $params['vdr_maxfilesize_gb'],
            "vdr_subtitles"          => $params['vdr_subtitles'],
            "vdr_subtitle_languages" => $params['vdr_subtitle_languages'],
            "vdr_epglanguage"        => $params['vdr_epglanguage'],
            "vdr_channelupdatemode"  => $params['vdr_channelupdatemode'],

            // Streamdev
            "vdr_streamdev_enable" => array_boolval($params, 'vdr_streamdev_enable'),
            "vdr_streamdev_port"   => $params['vdr_streamdev_port'],
            "vdr_streamdev_hosts"  => $params['vdr_streamdev_hosts'],

            // Live
            "vdr_live_enable" => array_boolval($params, 'vdr_live_enable'),
            "vdr_live_port"   => $params['vdr_live_port'],

            // VdrAdmin
            "vdradminam_enable" => array_boolval($params, 'vdradminam_enable'),
            "vdradminam_port"   => $params['vdradminam_port'],

            // Scan settings
            "w_scan" => $oldObject["w_scan"],
        );

        // Update the xmlConfig file. If it fails then generate an error
        if ($xmlConfig->replace($this->getXPath(), $object) === false) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);
        }

        // Notify configuration changes.
        $dispatcher = &OMVNotifyDispatcher::getInstance();
        $dispatcher->notify(
            OMV_NOTIFY_MODIFY,
            $this->getEventMessagePath(),
            $object
        );

        // Return the configuration object.
        return $object;
    }

    public function vdrIsRunning($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        $cmd = "pgrep -n vdr 2>&1";
        $result = $this->exec($cmd, $output);

        return $result === 0;
    }

    public function getScanSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        // Get the configuration object.
        $object = $xmlConfig->get($this->getWscanXPath());

        if (is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getWscanXPath()
            );
        }

        // Modify the result object.
        $object['atsc_scan_encrypted']  = boolval($object['atsc_scan_encrypted']);
        $object['dvb_t_scan_encrypted'] = boolval($object['dvb_t_scan_encrypted']);
        $object['dvb_c_extended_qam']   = boolval($object['dvb_c_extended_qam']);
        $object['dvb_c_scan_encrypted'] = boolval($object['dvb_c_scan_encrypted']);
        $object['dvb_s_scan_encrypted'] = boolval($object['dvb_s_scan_encrypted']);

        return $object;
    }

    public function setScanSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        $this->validateMethodParams(
            $params,
            '{
                "type"       : "object",
                "properties" : {
                    "transpondertype"      : { "type" : "string" },
                    "atsc_country"         : { "type" : "string" },
                    "atsc_type"            : { "type" : "number" },
                    "atsc_scan_encrypted"  : { "type" : "boolean" },
                    "dvb_t_country"        : { "type" : "string" },
                    "dvb_t_scan_encrypted" : { "type" : "boolean" },
                    "dvb_c_country"        : { "type" : "string" },
                    "dvb_c_qam"            : { "type" : "string", "maxLength" : "1" },
                    "dvb_c_symbolrate"     : { "type" : "string", "maxLength" : "1" },
                    "dvb_c_extended_qam"   : { "type" : "boolean" },
                    "dvb_c_scan_encrypted" : { "type" : "boolean" },
                    "dvb_s_country"        : { "type" : "string" },
                    "dvb_s_satellite"      : { "type" : "string" },
                    "dvb_s_scan_encrypted" : { "type" : "boolean" }
                }
            }'
        );

        // Update the configuration object.
        $object = array(
            "transpondertype"      => $params["transpondertype"],
            "atsc_country"         => $params["atsc_country"],
            "atsc_type"            => $params["atsc_type"],
            "atsc_scan_encrypted"  => array_boolval($params, "atsc_scan_encrypted"),
            "dvb_t_country"        => $params["dvb_t_country"],
            "dvb_t_scan_encrypted" => array_boolval($params, "dvb_t_scan_encrypted"),
            "dvb_c_country"        => $params["dvb_c_country"],
            "dvb_c_qam"            => $params["dvb_c_qam"],
            "dvb_c_symbolrate"     => $params["dvb_c_symbolrate"],
            "dvb_c_extended_qam"   => array_boolval($params, "dvb_c_extended_qam"),
            "dvb_c_scan_encrypted" => array_boolval($params, "dvb_c_scan_encrypted"),
            "dvb_s_country"        => $params["dvb_s_country"],
            "dvb_s_satellite"      => $params["dvb_s_satellite"],
            "dvb_s_scan_encrypted" => array_boolval($params, "dvb_s_scan_encrypted"),
        );

        if ($xmlConfig->replace($this->getWscanXPath(), $object) === false) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED,
                $this->getWscanXPath()
            );
        }

        // Return the configuration object.
        return $object;
    }

    private function getWscanCommand()
    {
        global $xmlConfig;

        // Get the configuration object.
        $object = $xmlConfig->get($this->getWscanXPath());

        if (is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getWscanXPath()
            );
        }

        $cmd = "";

        // Output file type is for VDR 1.7
        $outputMode = " -o 7 ";

        // Parse script based on transponder settings
        $transpoderType = $object["transpondertype"];

        switch ($transpoderType) {
            case self::WSCAN_ATSC:
                if (boolval($object["atsc_scan_encrypted"]) == false) {
                    $atsc_scan_encrypted = " -E 0";
                } else {
                    $atsc_scan_encrypted = "";
                }

                $str = " -c "
                     . $object["atsc_country"]
                     . " -A "
                     . $object["atsc_type"]
                     . $atsc_scan_encrypted;

                $cmd = "w_scan -fa"
                     . $str
                     . $outputMode;

                break;

            case self::WSCAN_CABLE:
                if ($object["dvb_c_qam"] == " ") {
                    $dvb_c_qam = "";
                } else {
                    $dvb_c_qam = " -Q " . $object["dvb_c_qam"];
                }

                if ($object["dvb_c_symbolrate"] == " ") {
                    $dvb_c_symbolrate = "";
                } else {
                    $dvb_c_symbolrate = " -S " . $object["dvb_c_symbolrate"];
                }

                if (boolval($object["dvb_c_extended_qam"]) == false) {
                    $dvb_c_extended_qam = "";
                } else {
                    $dvb_c_extended_qam = " -e 2";
                }

                if (boolval($object["dvb_c_scan_encrypted"]) == false) {
                    $dvb_c_scan_encrypted = " -E 0";
                } else {
                    $dvb_c_scan_encrypted = "";
                }

                $str = " -c " . $object["dvb_c_country"]
                     . $dvb_c_qam . $dvb_c_symbolrate
                     . $dvb_c_extended_qam
                     . $dvb_c_scan_encrypted;

                $cmd = "w_scan -fc"
                     . $str
                     . $outputMode;

                break;

            case self::WSCAN_TERRESTIAL:
                if (boolval($object["dvb_t_scan_encrypted"]) == false) {
                    $dvb_t_scan_encrypted = " -E 0";
                } else {
                    $dvb_t_scan_encrypted = "";
                }

                $str = " -c "
                     . $object["dvb_t_country"]
                     . $dvb_t_scan_encrypted;
                $cmd = "w_scan -ft"
                     . $str
                     . $outputMode;

                break;

            case self::WSCAN_SATELLITE:
                if (boolval($object["dvb_s_scan_encrypted"]) == false) {
                    $dvb_s_scan_encrypted = " -E 0";
                } else {
                    $dvb_s_scan_encrypted = "";
                }

                $str = " -c "
                     . $object["dvb_s_country"]
                     . " -s "
                     . $object["dvb_s_satellite"]
                     . $dvb_s_scan_encrypted;

                $cmd = "w_scan -fs"
                     . $str
                     . $outputMode;

                break;
        }

        return $cmd;
    }

    /**
     * Performs a channel scan
     *
     * @return void
     */
    public function executeChannelScan($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        // Check if scan is active
        // If active or checking failed return
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

            // Redirect stderr to $bgOutputFilename because of w_scans nature
            $cmd = sprintf(
                "%s > %s 2>%s",
                $this->getWscanCommand(),
                $this->tempChannelFileLocation,
                $bgOutputFilename
            );

            if (0 === $this->exec($cmd, $output)) {
                // Append channel.conf data to real file
                // and remove the temporary
                $cmd = sprintf(
                    "cat %1\$s > %2\$s; rm %1\$s",
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
     * Check if w_scan in running
     *
     * @return boolean
     */
    public function scanInProgress($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        $cmd = "pgrep -n w_scan 2>&1";
        $pgrepReturn = $this->exec($cmd, $output);

        if ($pgrepReturn === 0) {
            // "Channel scan is still running"
            return true;
        } elseif ($pgrepReturn === 1) {
            // "Channel Scan is not active"
            return false;
        } else {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode("\n", $output)
            );
        }
    }

    /**
     * Get channels from channels.conf
     *
     * @return array
     */
    public function getChannels($params, $context)
    {
        $cmd = sprintf("cat %s", $this->channelFileLocation);
        if (0 !== $this->exec($cmd, $output)) {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode("\n", $output)
            );
        }

        $channels = array();
        $groupStack = array();

        foreach ($output as $chanVal) {

            $channelString = trim($chanVal);

            if (!empty($channelString)) {
                if (substr($channelString, 0, 1) === ":") {
                    // Push to stack (emulated stack behaviour)
                    $groupStack[] = $channelString;

                    continue;
                }

                // Pop from stack (emulated stack behaviour)
                $channelGroup = array_pop($groupStack);

                $channelPortions = explode(":", $channelString);
                $channelNameCompany = explode(";", $channelPortions[0]);

                $channelEncrypted = $channelPortions[8] != "0";

                $channels[] = array(
                    "channel"          => $channelString,
                    "channelGroup"     => $channelGroup,
                    "channelName"      => $channelNameCompany[0],
                    "channelCompany"   => $channelNameCompany[1],
                    "channelEncrypted" => $channelEncrypted
                );
            }
        }

        return $channels;
    }

    /**
     * Save channels to channels.conf
     */
    public function setChannels($params, $context)
    {
        $config = $this->getSettings(array(), $context);
        $enable = $config["vdr_enable"];
        $channelConf = "";

        $vdrInit = new OMVSysVInitScript("vdr", false);
        $vdrAdminInit = new OMVSysVInitScript("vdradmin-am", false);

        foreach ($params["channels"] as $channel) {
            // Add group delimiter if it exists
            if (!empty($channel["channelGroup"])) {
                $channelConf .= $channel["channelGroup"] . PHP_EOL;
            }

            $channelConf .= $channel["channel"] . PHP_EOL;
        }

        $vdrAdminInit->stop();
        $vdrInit->stop();

        file_put_contents($this->channelFileLocation, $channelConf);

        // Only start services again if enabled
        if ($enable) {
            $vdrAdminInit->start();
            $vdrInit->start();
        }
    }

    public function checkDevices($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext(
            $context,
            array("role" => OMV_ROLE_ADMINISTRATOR)
        );

        $cmd = "if [ -d /dev/dvb ]; then ls /dev/dvb; fi";

        // If script fails to execute then create an error
        if (0 !== $this->exec($cmd, $output)) {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode("\n", $output)
            );
        }

        return count($output);
    }

    public function enumerateCountries($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext(
            $context,
            array("role" => OMV_ROLE_ADMINISTRATOR)
        );

        return $this->getWscanList(self::COUNTRY_LIST);
    }

    public function enumerateSatellites($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext(
            $context,
            array("role" => OMV_ROLE_ADMINISTRATOR)
        );

        return $this->getWscanList(self::SATELLITE_LIST);
    }

    private function getWscanList($type)
    {
        $cmd = sprintf("w_scan -%s? 2>&1", $type);

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
            $row = str_replace("\t\t", "\t", $row);
            $data = explode("\t", $row);

            if (self::COUNTRY_LIST === $type) {
                $list[] = array(
                    "abbr" => $data[0],
                    "country" => $data[1],
                );
            } elseif (self::SATELLITE_LIST === $type) {
                $list[] = array(
                    "abbr" => $data[0],
                    "satellite" => $data[1],
                );
            }
        }

        return $list;
    }
}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServiceVdr());
