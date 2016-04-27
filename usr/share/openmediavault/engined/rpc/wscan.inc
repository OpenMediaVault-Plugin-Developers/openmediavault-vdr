<?php

/**
 * Copyright (C) 2013-2015 OpenMediaVault Plugin Developers.
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

namespace OMV\Engined\Rpc;

use Exception;
use OMV\ExecException;
use OMV\Rpc\ServiceAbstract;
use OMV\System\Process;
use SplFileObject;

class Wscan extends ServiceAbstract
{
    const
        COUNTRY_LIST = 'c',
        SATELLITE_LIST = 's';

    const
        WSCAN_ATSC = 'a',
        WSCAN_CABLE = 'c',
        WSCAN_SATELLITE = 's',
        WSCAN_TERRESTIAL = 't';

    /** @var string */
    private $channelsFileLocation = '/etc/vdr/channels.conf';

    // FIXME: For security reasons the temporary file should not have a static name.
    /** @var string */
    private $tempChannelsFileLocation = '/tmp/channels.conf';

    /**
     * Get the name of the RPC service.
     *
     * @return string
     */
    public function getName()
    {
        return 'Wscan';
    }

    /**
     * Initialize the RPC service.
     *
     * @return void
     */
    public function initialize()
    {
        $this->registerMethod('enumerateCountries');
        $this->registerMethod('enumerateSatellites');
        $this->registerMethod('scan');
        $this->registerMethod('scanning');
    }

    /**
     * Enumerate available countries.
     *
     * @param array $params  The method paramaters.
     * @param array $context The context of the caller.
     *
     * @return array
     */
    public function enumerateCountries($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        return $this->getWscanList(self::COUNTRY_LIST);
    }

    /**
     * Enumerate available satellites.
     *
     * @param array $params  The method paramaters.
     * @param array $context The context of the caller.
     *
     * @return array
     */
    public function enumerateSatellites($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        return $this->getWscanList(self::SATELLITE_LIST);
    }

    /**
     * Perform a channel scan.
     *
     * @param array $params  The method paramaters.
     * @param array $context The context of the caller.
     *
     * @return string
     */
    public function scan($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.wscan.scan');

        // Check if scan is active. If active or checking failed return.
        if ($this->callMethod('scanning', [], $context)) {
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
            $this->updateBgProcStatus($bgStatusFilename, 'outputfilename', $bgOutputFilename);

            $optional = [];

            if (isset($params['atsc_type'])) {
                $optional['atscType'] = $params['atsc_type'];
            }

            if (isset($params['dvb_c_modulation'])) {
                if ($params['dvb_c_modulation'] != -1) {
                    $optional['dvbcModulation'] = $params['dvb_c_modulation'];
                }
            }

            if (isset($params['dvb_c_symbol_rate'])) {
                if ($params['dvb_c_symbol_rate'] != -1) {
                    $optional['dvbcSymbolRate'] = $params['dvb_c_symbol_rate'];
                }
            }

            if (isset($params['dvb_c_extended_qam'])) {
                $optional['dvbcExtendedQam'] = $params['dvb_c_extended_qam'];
            }

            if (isset($params['dvb_s_satellite'])) {
                $optional['dvbsSatellite'] = $params['dvb_s_satellite'];
            }

            $cmd = $this->buildWscanCommand(
                $params['frontend_type'],
                $params['include_radio_channels'],
                $params['include_tv_channels'],
                $params['include_other_services'],
                $params['include_encrypted_channels'],
                $params['country'],
                $this->tempChannelsFileLocation,
                $bgOutputFilename,
                $optional
            );

            try {
                $cmd->execute($output);

                $tempChannelsFile = new SplFileObject($this->tempChannelsFileLocation);
                $channelsFile = new SplFileObject($this->channelsFileLocation, 'w+');
                $channelsFile->fwrite($tempChannelsFile->fread($tempChannelsFile->getSize()));
            } finally {
                // Always remove the temporary channels.conf.
                unlink($this->tempChannelsFileLocation);
            }

            $this->finalizeBgProcStatus($bgStatusFilename, $output);
            exit(0);
        } catch (Exception $e) {
            $this->finalizeBgProcStatus($bgStatusFilename, '', $e);
            exit(1);
        }
    }

    /**
     * Check if a scan is in progress.
     *
     * @return bool
     */
    public function scanning($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $cmd = new Process('pgrep', '-n', 'w_scan');
        $cmd->setQuiet();
        $cmd->setRedirect2to1();
        $cmd->execute($output, $exitStatus);

        if ($exitStatus === 0) {
            return true;
        }

        if ($exitStatus === 1) {
            return false;
        }

        throw new ExecException($cmd->getCommandLine(), $output);
    }

    /**
     * Build the w_scan command.
     *
     * @return Process
     */
    private function buildWscanCommand(
        $frontendType,
        $includeRadioChannels,
        $includeTvChannels,
        $includeOtherServices,
        $includeEncryptedChannels,
        $country,
        $channelsFile,
        $stdErrFile,
        $optional = []
    ) {
        $args = [];

        $args['-f'] = $frontendType;

        // Set which services to include.
        $args['-R'] = $includeRadioChannels ? 1 : 0;
        $args['-T'] = $includeTvChannels ? 1 : 0;
        $args['-O'] = $includeOtherServices ? 1 : 0;
        $args['-E'] = $includeEncryptedChannels ? 1 : 0;

        $args['-c'] = $country;

        // Frontend specific options.
        if ($frontendType === self::WSCAN_ATSC) {
            $args['-A'] = $optional['atscType'];
        }

        if ($frontendType === self::WSCAN_CABLE) {
            if (isset($optional['dvbcModulation'])) {
                $args['-Q'] = $optional['dvbcModulation'];
            }

            if (isset($optional['dvbcSymbolRate'])) {
                $args['-S'] = $optional['dvbcSymbolRate'];
            }

            if (isset($optional['dvbcExtendedQam'])) {
                if ($optional['dvbcExtendedQam']) {
                    $args['-e'] = 2;
                }
            }
        }

        if ($frontendType === self::WSCAN_SATELLITE) {
            $args['-s'] = $optional['dvbsSatellite'];
        }

        $parameters = [];

        foreach ($args as $argumentKey => $argumentValue) {
            $parameters[] = $argumentKey;
            $parameters[] = $argumentValue;
        }

        // Save main stdout as channels.conf file.
        $parameters[] = '>';
        $parameters[] = $channelsFile;

        // Capture stderr output to display scan progress.
        $parameters[] = '2>' . $stdErrFile;

        return new Process('w_scan ', ...$parameters);
    }

    private function getWscanList($type)
    {
        $cmd = new Process('w_scan', '-' . $type . '?');
        $cmd->setRedirect2to1();
        $cmd->execute($output);

        $list = [];

        foreach ($output as $row) {
            $row = trim($row);
            $data = preg_split("/\t+/", $row);

            $entry = [];

            $entry['abbr'] = $data[0];

            if (self::COUNTRY_LIST === $type) {
                $entry['country'] = $data[1];
            }

            if (self::SATELLITE_LIST === $type) {
                $entry['satellite'] = $data[1];
            }

            $list[] = $entry;
        }

        return $list;
    }
}
