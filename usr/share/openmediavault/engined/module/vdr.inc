<?php
/**
 * Copyright (C) 2013 OpenMediaVault Plugin Developers
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

require_once ("openmediavault/module.inc");
require_once ("openmediavault/config.inc");
require_once ("openmediavault/error.inc");
require_once ("openmediavault/initscript.inc");

class OMVModuleVdrPlugin extends OMVModuleServiceAbstract
    implements OMVINotifyListener, OMVIModuleServiceStatus
{
    public function getName()
    {
        return "VDR";
    }

    public function applyConfig()
    {
        $cmd = "omv-mkconf vdr 2>&1";

        if (0 !== $this->exec($cmd, $output))
            throw new OMVException(OMVErrorMsg::E_EXEC_FAILED, $cmd, implode("\n", $output));
    }

    public function getStatus()
    {
        global $xmlConfig;

        // Get the configuration object.
        $xpath = "//services/vdr";
        $object = $xmlConfig->get($xpath);

        // If no data is found then create an error
        if (is_null($object))
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $xpath);

        return array(
            "name" => $this->getName(),
            "title" => gettext("VDR"),
            "enabled" => boolval($object['vdr_enable']),
            "running" => ("running"));
    }

    function bindListeners(OMVNotifyDispatcher $dispatcher)
    {
        // Bind Listeners function is used to add monitoring about changes made to the configuration
        // After configuration changes It activates the message:
        // "The configuration has been changed. You must apply ... Apply button"
        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            "org.openmediavault.services.vdr",
            array($this, "setDirty"));
    }

}

// Register the Module
$moduleMgr = &OMVModuleMgr::getInstance();
$moduleMgr->registerModule(new OMVModuleVdrPlugin());
