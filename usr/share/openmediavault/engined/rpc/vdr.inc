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

use SplFileInfo;
use SplStack;

use OMV\Config\Database;
use OMV\Engine\Notify\Dispatcher;
use OMV\Rpc\ServiceAbstract;

class Vdr extends ServiceAbstract
{
    /** @var string */
    private $channelsFileLocation = '/etc/vdr/channels.conf';

    /** @var string */
    private $channelsEventMessagePath = 'org.openmediavault.conf.service.vdr.channels';

    /** @var Database */
    private $database;

    /** @var string */
    private $dataModelPath = 'conf.service.vdr';

    /** @var Dispatcher */
    private $dispatcher;

    /** @var string */
    private $eventMessagePath = 'org.openmediavault.conf.service.vdr';

    public function __construct(Database $database = null, Dispatcher $dispatcher = null)
    {
        $this->database = $database ?: Database::getInstance();
        $this->dispatcher = $dispatcher ?: Dispatcher::getInstance();
    }

    /**
     * Get the name of the RPC service.
     *
     * @return string
     */
    public function getName()
    {
        return 'Vdr';
    }

    /**
     * Initialize the RPC service.
     *
     * @return void
     */
    public function initialize()
    {
        $this->registerMethod('getSettings');
        $this->registerMethod('setSettings');
        $this->registerMethod('getChannels');
        $this->registerMethod('setChannels');
    }

    /**
     * Get the settings of the service.
     *
     * @param array $params  The method paramaters.
     * @param array $context The context of the caller.
     * @return array
     */
    public function getSettings($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);

        $object = $this->database->get($this->dataModelPath);

        return $object->getAssoc();
    }

    /**
     * Set the settings of the service.
     *
     * @param array $params  The method paramaters.
     * @param array $context The context of the caller.
     * @return array
     */
    public function setSettings($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.vdr.setsettings');

        $object = $this->database->get($this->dataModelPath);
        $object->setAssoc($params);

        $this->database->set($object);
        $this->dispatcher->notify(OMV_NOTIFY_MODIFY, $this->eventMessagePath, $object);

        return $object->getAssoc();
    }

    /**
     * Get channels from channels.conf.
     *
     * @return array
     */
    public function getChannels($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.common.getlist');

        $channels = [];
        $groupStack = new SplStack();
        $file = new SplFileInfo($this->channelsFileLocation);
        $targetFile = new SplFileInfo($file->getLinkTarget());

        // The target file doesn't exist yet so no channels can be loaded.
        // Exit early.
        if (!$targetFile->isFile()) {
            return $channels;
        }

        $fileObject = $file->openFile();

        while (!$fileObject->eof()) {
            $channelString = trim($fileObject->fgets());

            if (!empty($channelString)) {
                // If the line begins with ':' it's a group. Save it in the stack
                // and use it with the next line.
                if (substr($channelString, 0, 1) === ':') {
                    $groupStack->push($channelString);
                    continue;
                }

                // Since the group is optional, set it to null by default.
                $channelGroup = null;

                // Pop the group from the stack if it exists.
                if (!$groupStack->isEmpty()) {
                    $channelGroup = $groupStack->pop();
                }

                $channelPortions = explode(':', $channelString);
                $channelNameCompany = explode(';', $channelPortions[0]);

                $channelEncrypted = $channelPortions[8] != '0';

                $channels[] = [
                    'channel' => $channelString,
                    'group' => $channelGroup,
                    'name' => $channelNameCompany[0],
                    'company' => $channelNameCompany[1],
                    'encrypted' => $channelEncrypted,
                ];
            }
        }

        return $channels;
    }

    /**
     * Save channels to channels.conf.
     *
     * @return void
     */
    public function setChannels($params, $context)
    {
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        $this->validateMethodParams($params, 'rpc.vdr.setchannels');

        $this->dispatcher->notify(OMV_NOTIFY_MODIFY, $this->channelsEventMessagePath, [
            'file' => $this->channelsFileLocation,
            'channels' => $params['channels'],
        ]);
    }
}
