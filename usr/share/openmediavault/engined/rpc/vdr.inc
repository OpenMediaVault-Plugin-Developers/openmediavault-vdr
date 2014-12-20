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

use Exception;
use SplFileInfo as FileInfo;

class OMVRpcServiceVdr extends OMVRpcServiceAbstract
{
    private $channelsFileLocation = "/etc/vdr/channels.conf";

    private function getEventMessagePath()
    {
        return "org.openmediavault.services.vdr";
    }

    private function getXpath()
    {
        return "/config/services/vdr";
    }

    public function getName()
    {
        return "Vdr";
    }

    public function initialize()
    {
        $this->registerMethod("getSettings");
        $this->registerMethod("setSettings");
        $this->registerMethod("getChannels");
        $this->registerMethod("setChannels");
        $this->registerMethod("checkDevices");
        $this->registerMethod("isRunning");
    }

    public function getSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        // Get the configuration object.
        $object = $xmlConfig->get($this->getXpath());

        if (is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXpath()
            );
        }

        $object["enable"] = boolval($object["enable"]);
        $object["log_level"] = intval($object["log_level"]);
        $object["max_video_file_size"] = intval($object["max_video_file_size"]);
        $object["subtitle_enable"] = boolval($object["subtitle_enable"]);
        $object["update_channels"] = intval($object["update_channels"]);

        return $object;
    }

    public function setSettings($params, $context)
    {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array(
            "role" => OMV_ROLE_ADMINISTRATOR
        ));

        // Validate the parameters of the RPC service method.
        $this->validateMethodParams(
            $params,
            '{
                "type": "object",
                "properties": {
                    "enable": { "type": "boolean" },
                    "log_level": { "type": "integer", "minimum": 0, "maximum": 3 },
                    "max_video_file_size": { "type": "integer", "minimum": 1 },
                    "video.sharedfolderref": {' . $GLOBALS["OMV_JSONSCHEMA_UUID_NONE"] . '},
                    "audio_languages": { "type": "string" },
                    "epg_languages": { "type": "string" },
                    "subtitle_enable": { "type" : "boolean" },
                    "subtitle_languages": { "type" : "string" },
                    "update_channels": { "type": "integer", "minimum": 0, "maximum": 6 },
                    "extra_options": { "type" : "string", "optional": true }
                }
            }'
        );

        $object = array(
            "enable" => boolval($params["enable"]),
            "log_level" => intval($params["log_level"]),
            "max_video_file_size" => intval($params["max_video_file_size"]),
            "video.sharedfolderref" => $params["video.sharedfolderref"],
            "audio_languages" => $params["audio_languages"],
            "epg_languages" => $params["epg_languages"],
            "subtitle_enable" => boolval($params["subtitle_enable"]),
            "subtitle_languages" => $params["subtitle_languages"],
            "update_channels" => intval($params["update_channels"]),
            "extra_options" => $params["extra_options"],
        );

        if ($xmlConfig->replace($this->getXpath(), $object) === false) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);
        }

        // Notify configuration changes.
        $dispatcher = &OMVNotifyDispatcher::getInstance();
        $dispatcher->notify(
            OMV_NOTIFY_MODIFY,
            $this->getEventMessagePath(),
            $object
        );

        return $object;
    }

    /**
     * Get channels from channels.conf.
     *
     * @return array
     */
    public function getChannels($params, $context)
    {
        $channels = array();
        $groupStack = array();
        $file = new FileInfo($this->channelsFileLocation);
        $targetFile = new FileInfo($file->getLinkTarget());

        // The target file doesn't exist yet so no channels can be loaded.
        // Exit early.
        if (!$targetFile->isFile()) {
            return $channels;
        }

        $fileObject = $file->openFile();

        while (!$fileObject->eof()) {
            $channelString = trim($fileObject->fgets());

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
                    "channel" => $channelString,
                    "group" => $channelGroup,
                    "name" => $channelNameCompany[0],
                    "company" => $channelNameCompany[1],
                    "encrypted" => $channelEncrypted
                );
            }
        }

        return $channels;
    }

    /**
     * Save channels to channels.conf.
     */
    public function setChannels($params, $context)
    {
        $config = $this->callMethod("getSettings", array(), $context);
        $enable = $config["enable"];
        $channelsConf = "";

        $init = new OMVSysVInitScript("vdr");

        foreach ($params["channels"] as $channel) {
            // Add group delimiter if it exists
            if (!empty($channel["group"])) {
                $channelConf .= $channel["group"] . PHP_EOL;
            }

            $channelsConf .= $channel["channel"] . PHP_EOL;
        }

        $init->stop();

        $file = new FileInfo($this->channelsFileLocation);

        if (!$file->isWritable()) {
            throw new Exception("The channels.conf file is not writeable.");
        }

        $fileObject = $file->openFile("w");
        $fileObject->fwrite($channelsConf);

        // Only start services again if enabled
        if ($enable) {
            $init->start();
        }
    }

    public function checkDevices($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext(
            $context,
            array("role" => OMV_ROLE_ADMINISTRATOR)
        );

        $cmd = "export LANG=C; if [ -d /dev/dvb ]; then ls /dev/dvb; fi";

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

    public function isRunning($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR));

        $cmd = "export LANG=C; pgrep -n vdr 2>&1";
        $result = $this->exec($cmd, $output);

        return $result === 0;
    }
}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServiceVdr());
