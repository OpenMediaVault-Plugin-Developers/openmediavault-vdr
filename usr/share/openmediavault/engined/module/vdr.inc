<?php

/**
 * Copyright (C) 2013-2015 OpenMediaVault Plugin Developers
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
require_once "openmediavault/module.inc";
require_once "openmediavault/notify.inc";
require_once "openmediavault/systemctl.inc";

class OMVModuleVdr extends OMVModuleServiceAbstract implements
    OMVINotifyListener,
    OMVIModuleServiceStatus
{
    private function getEventMessagePath()
    {
        return "org.openmediavault.services.vdr";
    }

    private function getChannelsEventMessagePath()
    {
        return "org.openmediavault.services.vdr.channels";
    }

    private function getSharedFolderEventMessagePath()
    {
        return "org.openmediavault.system.shares.sharedfolder";
    }

    /**
     * Get the service configuration XPath.
     *
     * @return string
     */
    private function getXpath()
    {
        return "/config/services/vdr";
    }

    /**
     * Get the module name.
     *
     * @return string
     */
    public function getName()
    {
        return "vdr";
    }

    /**
     * Get the status of the service.
     *
     * @return array
     *
     * @throws OMVException
     */
    public function getStatus()
    {
        global $xmlConfig;

        $object = $xmlConfig->get($this->getXpath());

        if (is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXpath()
            );
        }

        $systemCtl = new OMVSystemCtl($this->getName());

        return [
            "name" => $this->getName(),
            "title" => gettext("VDR"),
            "enabled" => boolval($object["enable"]),
            "running" => $systemCtl->isActive()
        ];
    }

    /**
     * Create and update the configuration.
     *
     * @return void
     *
     * @throws OMVException
     */
    public function applyConfig()
    {
        $cmd = sprintf("export LANG=C; omv-mkconf %s 2>&1", $this->getName());

        if (0 !== $this->exec($cmd, $output)) {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode(PHP_EOL, $output)
            );
        }

        $this->execTasks("channels");
    }

    /**
     * Start the managed service.
     *
     * @return void
     *
     * @throws OMVException
     */
    public function startService()
    {
        global $xmlConfig;

        $object = $xmlConfig->get($this->getXpath());

        if (is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXpath()
            );
        }

        if (!boolval($object["enable"])) {
            return;
        }

        $systemCtl = new OMVSystemCtl($this->getName());
        $systemCtl->enable(true);
    }

    /**
     * Stop the managed service.
     *
     * @return void
     */
    public function stopService()
    {
        $systemCtl = new OMVSystemCtl($this->getName());
        $systemCtl->disable(true);
    }

    public function onChannelsSave($type, $path, $object)
    {
        $this->addTask("channels", "saveChannels", $object);
    }

    public function saveChannels($params)
    {
        $rows= [];

        foreach ($params["channels"] as $channel) {
            // Add group delimiter if it exists.
            if (!empty($channel["group"])) {
                $rows[] = $channel["group"];
            }

            $rows[] = $channel["channel"];
        }

        $file = new SplFileInfo($params["file"]);

        if (!$file->isWritable()) {
            throw new Exception("The file 'channels.conf' is not writeable.");
        }

        $fileObject = $file->openFile("w");
        $fileObject->fwrite(implode(PHP_EOL, $rows));
    }

    /**
     * Bind listeners.
     *
     * @param OMVNotifyDispatcher $dispatcher
     * @return void
     */
    public function bindListeners(OMVNotifyDispatcher $dispatcher)
    {
        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->getEventMessagePath(),
            [$this, "setDirty"]
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->getSharedFolderEventMessagePath(),
            [$this, "setDirty"]
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->getChannelsEventMessagePath(),
            [$this, "setDirty"]
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->getChannelsEventMessagePath(),
            [$this, "onChannelsSave"]
        );
    }
}

// Register the module.
$moduleMgr = &OMVModuleMgr::getInstance();
$moduleMgr->registerModule(new OMVModuleVdr());
