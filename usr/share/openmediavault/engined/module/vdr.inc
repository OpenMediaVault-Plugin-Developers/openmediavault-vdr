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

namespace OMV\Engined\Module;

use SplFileInfo;

use OMV\Config\Database;
use OMV\Exception;
use OMV\Engine\Module\IServiceStatus;
use OMV\Engine\Module\ServiceAbstract;
use OMV\Engine\Notify\Dispatcher;
use OMV\Engine\Notify\IListener;
use OMV\System\Process;
use OMV\System\SystemCtl;

class Vdr extends ServiceAbstract implements
    IListener,
    IServiceStatus
{
    /** @var string */
    private $channelsEventMessagePath = 'org.openmediavault.services.vdr.channels';

    /** @var Database */
    private $database;

    /** @var string */
    private $dataModelPath = 'conf.service.vdr';

    /** @var string */
    private $eventMessagePath = 'org.openmediavault.services.vdr';

    /** @var string */
    private $serviceName = 'vdr.service';

    /** @var string */
    private $sharedFolderEventMessagePath = 'org.openmediavault.system.shares.sharedfolder';

    public function __construct(Database $database = null)
    {
        $this->database = $database ?: Database::getInstance();
    }

    /**
     * Get the module name.
     *
     * @return string
     */
    public function getName()
    {
        return 'vdr';
    }

    /**
     * Get the module status.
     *
     * @return array
     */
    public function getStatus()
    {
        $object = $this->database->get($this->dataModelPath);
        $systemCtl = new SystemCtl($this->serviceName);

        return [
            'name' => $this->getName(),
            'title' => gettext('VDR'),
            'enabled' => $object->get('enable'),
            'running' => $systemCtl->isActive(),
        ];
    }

    /**
     * Create and update the configuration.
     *
     * @return void
     */
    public function applyConfig()
    {
        $cmd = new Process('omv-mkconf', $this->getName());
        $cmd->setRedirect2to1();
        $cmd->execute();

        $this->execTasks('channels');
    }

    /**
     * Start the managed service.
     *
     * @return void
     */
    public function startService()
    {
        $object = $this->database->get($this->dataModelPath);

        if ($object->get('enable')) {
            $systemCtl = new SystemCtl($this->serviceName);
            $systemCtl->enable(true);
        }
    }

    /**
     * Stop the managed service.
     *
     * @return void
     */
    public function stopService()
    {
        $systemCtl = new SystemCtl($this->serviceName);
        $systemCtl->disable(true);
    }

    public function onChannelsSave($type, $path, $object)
    {
        $this->addTask('channels', 'saveChannels', $object);
    }

    public function saveChannels($params)
    {
        $rows = [];

        foreach ($params['channels'] as $channel) {
            // Add group delimiter if it exists.
            if (!empty($channel['group'])) {
                $rows[] = $channel['group'];
            }

            $rows[] = $channel['channel'];
        }

        $file = new SplFileInfo($params['file']);

        if (!$file->isWritable()) {
            throw new Exception('The file \'channels.conf\' is not writeable.');
        }

        $fileObject = $file->openFile('w');
        $fileObject->fwrite(implode(PHP_EOL, $rows));
    }

    /**
     * Bind listeners.
     *
     * @param Dispatcher $dispatcher
     * @return void
     */
    public function bindListeners(Dispatcher $dispatcher)
    {
        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->eventMessagePath,
            [$this, 'setDirty']
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->sharedFolderEventMessagePath,
            [$this, 'setDirty']
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->channelsEventMessagePath,
            [$this, 'setDirty']
        );

        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->channelsEventMessagePath,
            [$this, 'onChannelsSave']
        );
    }
}
