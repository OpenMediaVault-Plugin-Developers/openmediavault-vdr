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

require_once("openmediavault/object.inc");
require_once("openmediavault/config.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/util.inc");
require_once("openmediavault/rpcservice.inc");
require_once("openmediavault/notify.inc");

class OMVRpcServiceVDRPlugin extends OMVRpcServiceAbstract {
    public function getName() { return "VDR";} // RPC Service name. Same as in .js files

    /* Initialize the RPC service. Different methods of the RPC service are declared here*/
    public function initialize() {
		$this->registerMethod("getSettings"); // Method name. Same as in .js files
		$this->registerMethod("setSettings"); // Method name. Same as in .js files
        $this->registerMethod("scanChannels"); // Method name. Same as in .js files
        $this->registerMethod("scanStatus"); // Method name. Same as in .js files
     	}

    public function getSettings($params, $context) {

        // Reference to the global declaration of the variable $xmlConfig (Needed always)
		global $xmlConfig; 

        // Validate the RPC caller context.
        // This is used to check that only the admin can use this function 
        // Extra security as usermanagement is also done in the web interface
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR)); 
        // The $context contains the fields username and role
        // Role can also be "OMV_ROLE_USER" or "OMV_ROLE_EVERYONE" (user and admin)


        // Get the configuration object.
        $xpath = "//services/vdrplugin"; // Structure of the xml schema
        $object = $xmlConfig->get($xpath); // Read data from the xmlConfig file 
        // If no data is found then create an error
        if(is_null($object)) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,$xpath);
        }


        // Modify the result object. (Change characters to values)
        $object['vdr_enable'] = boolval($object['vdr_enable']);
        //['vdr_transpondertype'];
        //vdr_atsc_country
        //vdr_atsc_type
        $object['vdr_atsc_scan_encrypted'] = boolval($object['vdr_atsc_scan_encrypted']);
        //vdr_dvb_t_country
        $object['vdr_dvb_t_scan_encrypted'] = boolval($object['vdr_dvb_t_scan_encrypted']);
        //vdr_dvb_c_country
        //$object['vdr_dvb_c_qam'] = intval ($object['vdr_dvb_c_qam']);
        //$object['vdr_dvb_c_symbolrate'] = intval ($object['vdr_dvb_c_symbolrate']);
        $object['vdr_dvb_c_extended_qam'] = boolval($object['vdr_dvb_c_extended_qam']);
        $object['vdr_dvb_c_scan_encrypted'] = boolval($object['vdr_dvb_c_scan_encrypted']);
        //vdr_dvb_s_country
        //vdr_dvb_s_satellite
        $object['vdr_dvb_s_scan_encrypted'] = boolval($object['vdr_dvb_s_scan_encrypted']);

        //vdr_recordingdir
        $object['vdr_maxfilesize_gb'] = intval($object['vdr_maxfilesize_gb']);
        $object['vdr_subtitles'] = boolval($object['vdr_subtitles']);
        //vdr_subtitle_languages
        //vdr_epglanguage
        //vdr_channelupdatemode

        $object['vdradminam_enable'] = boolval($object['vdradminam_enable']);
        $object['vdradminam_port'] = intval($object['vdradminam_port']);

        return $object;
	}

//*****************************************************************    
//*****************************************************************
//*****************************************************************

    public function setSettings($params, $context) {
		// Check comments from getSettings
		global $xmlConfig; 
        $this->validateMethodContext($context, array("role" => OMV_ROLE_ADMINISTRATOR)); 

        $this->validateMethodParams($params, '{
            "type":"object",
            "properties":{
                "vdr_enable":{"type":"boolean"},
                "vdr_transpondertype":{"type":"string"},  
                "vdr_atsc_country":{"type":"string"},
                "vdr_atsc_type":{"type":"number"},
                "vdr_atsc_scan_encrypted":{"type":"boolean"},
                "vdr_dvb_t_country":{"type":"string"},
                "vdr_dvb_t_scan_encrypted":{"type":"boolean"},
                "vdr_dvb_c_country":{"type":"string"},
                "vdr_dvb_c_qam":{"type":"string", "minLength":"1", "maxLength":"1"},
                "vdr_dvb_c_symbolrate":{"type":"string", "minLength":"1", "maxLength":"1"},
                "vdr_dvb_c_extended_qam":{"type":"boolean"},
                "vdr_dvb_c_scan_encrypted":{"type":"boolean"},
                "vdr_dvb_s_country":{"type":"string"},
                "vdr_dvb_s_satellite":{"type":"string"},
                "vdr_dvb_s_scan_encrypted":{"type":"boolean"},
                "vdr_recordingdir":{"type":"string"},
                "vdr_maxfilesize_gb":{"type":"integer","minimum":1},
                "vdr_subtitles":{"type":"boolean"},
                "vdr_subtitle_languages":{"type":"string"},
                "vdr_epglanguage":{"type":"string"},
                "vdr_channelupdatemode":{"type":"number","minimum":0,"maximum":6},
                "vdradminam_enable":{"type":"boolean"},
                "vdradminam_port":{"type":"integer","minimum":1,"maximum":65535}
                }
            }'
        );

        // Get the existing configuration object.
        $xpath = "//services/vdrplugin"; // Structure of the xml schema
        $oldObject = $xmlConfig->get($xpath); // Read data from the xmlConfig file
        // If no data is found then create an error
        if(is_null($oldObject)) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,$xpath);
        }
      


        // Update the configuration object. 
        $object = array(
            "vdr_enable" => array_boolval($params, 'vdr_enable'),
            "vdr_transpondertype" => $params['vdr_transpondertype'],
            "vdr_atsc_country" => $params['vdr_atsc_country'],
            "vdr_atsc_type" => $params['vdr_atsc_type'],
            "vdr_atsc_scan_encrypted" => array_boolval($params, 'vdr_atsc_scan_encrypted'),
            "vdr_dvb_t_country" => $params['vdr_dvb_t_country'],
            "vdr_dvb_t_scan_encrypted" => array_boolval($params, 'vdr_dvb_t_scan_encrypted'),
            "vdr_dvb_c_country" => $params['vdr_dvb_c_country'],
            "vdr_dvb_c_qam" => $params['vdr_dvb_c_qam'],
            "vdr_dvb_c_symbolrate" => $params['vdr_dvb_c_symbolrate'],
            "vdr_dvb_c_extended_qam" => array_boolval($params, 'vdr_dvb_c_extended_qam'),
            "vdr_dvb_c_scan_encrypted" => array_boolval($params, 'vdr_dvb_c_scan_encrypted'),
            "vdr_dvb_s_country" => $params['vdr_dvb_s_country'],
            "vdr_dvb_s_satellite" => $params['vdr_dvb_s_satellite'],
            "vdr_dvb_s_scan_encrypted" => array_boolval($params, 'vdr_dvb_s_scan_encrypted'),
            "vdr_recordingdir" => $params['vdr_recordingdir'],
            "vdr_maxfilesize_gb" => $params['vdr_maxfilesize_gb'],
            "vdr_subtitles" => $params['vdr_subtitles'],
            "vdr_subtitle_languages" => $params['vdr_subtitle_languages'],
            "vdr_epglanguage" => $params['vdr_epglanguage'],
            "vdr_channelupdatemode" => $params['vdr_channelupdatemode'],
            "vdradminam_enable" => array_boolval($params, 'vdradminam_enable'),
            "vdradminam_port" => $params['vdradminam_port']
        );

        // Update the xmlConfig file. If it fails then generate an error
        if(FALSE === $xmlConfig->replace("//services/vdrplugin", $object)) {
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);
        }

        // Notify configuration changes.
        $dispatcher = &OMVNotifyDispatcher::getInstance();
        $dispatcher->notify(OMV_NOTIFY_MODIFY, "org.openmediavault.services.vdr", $object);

        // Return the configuration object.
        return $object;
    }

//*****************************************************************    
//*****************************************************************
//*****************************************************************

    public function scanChannels($params, $context) {

        // Check if scan is active
        // If active or checking failed return
        $scanStatusRet = $this->scanStatus();
        if ("1" !== $scanStatusRet) {
            return $scanStatusRet;
        }

        // temporary file      
        $channelFile = "/tmp/channels.conf";
        $ouputMode = " -o 7 "; // Output file type is for VDR 1.7

        // Parse script based on transponder settings
        $transpoderType = $params['vdr_transpondertype'];

        switch ($transpoderType) {
            case a: if (boolval($params['vdr_atsc_scan_encrypted']) == false) {
                        $vdr_atsc_scan_encrypted = " -E 0";
                    }
                    else {
                        $vdr_atsc_scan_encrypted = "";
                    }

                    $str = " -c " . $params['vdr_atsc_country'] . " -A " . $params['vdr_atsc_type'] . $vdr_atsc_scan_encrypted;
                    $cmd = "w_scan -fa" . $str . $outputMode . " >> ". $channelFile;
                    break;
            
            case c: if ($params['vdr_dvb_c_qam'] == " ") {
                        $vdr_dvb_c_qam = "";
                    }
                    else {
                        $vdr_dvb_c_qam = " -Q " . $params['vdr_dvb_c_qam'];
                    }
                    
                    if ($params['vdr_dvb_c_symbolrate'] == " ") {
                        $vdr_dvb_c_symbolrate = "";
                    }
                    else {
                        $vdr_dvb_c_symbolrate = " -S " . $params['vdr_dvb_c_symbolrate'];
                    }

                    if (boolval($params['vdr_dvb_c_extended_qam']) == false) {
                        $vdr_dvb_c_extended_qam = "";
                    }
                    else {
                        $vdr_dvb_c_extended_qam = " -e 2";
                    }

                    if (boolval($params['vdr_dvb_c_scan_encrypted']) == false) {
                        $vdr_dvb_c_scan_encrypted = " -E 0";
                    }
                    else {
                        $vdr_dvb_c_scan_encrypted = "";
                    }

                    $str = " -c " . $params['vdr_dvb_c_country'] . $vdr_dvb_c_qam . $vdr_dvb_c_symbolrate . $vdr_dvb_c_extended_qam . $vdr_dvb_c_scan_encrypted;
                    $cmd = "w_scan -fc" . $str . $outputMode . " >> ". $channelFile;
                    break;

            case t: if (boolval($params['vdr_dvb_t_scan_encrypted']) == false) {
                        $vdr_dvb_t_scan_encrypted = " -E 0";
                    }
                    else {
                        $vdr_dvb_t_scan_encrypted = "";
                    }

                    $str = " -c " . $params['vdr_dvb_t_country'] . $vdr_dvb_t_scan_encrypted;
                    $cmd = "w_scan -ft" . $str . $outputMode . " >> ". $channelFile;
                    break;
            
            case s: if (boolval($params['vdr_dvb_s_scan_encrypted']) == false) {
                        $vdr_dvb_s_scan_encrypted = " -E 0";
                    }
                    else {
                        $vdr_dvb_s_scan_encrypted = "";
                    }

                    $str = " -c " . $params['vdr_dvb_s_country'] . " -s " . $params['vdr_dvb_s_satellite'] . $vdr_dvb_s_scan_encrypted;
                    $cmd = "w_scan -fs" . $str . $outputMode . " >> ". $channelFile;
                    break;
        }
        

        $cmd = $cmd . ";" . "cat " . $channelFile . " > /etc/vdr/channels.conf;" . "rm " . $channelFile . ";";
        // If script fails to execute then create an error
        if(0 !== $this->exec($cmd, $output)) {
            throw new OMVException(OMVErrorMsg::E_EXEC_FAILED, $cmd, implode("\n", $output));
            return "-1";
        }
    
        return "1"; // Channel Scan Complete
    }

//*****************************************************************    
//*****************************************************************
//*****************************************************************

    public function scanStatus($params, $context) {
        // Function to check if w_scan is still active;

        $cmd = "pgrep -n w_scan 2>&1";

        $pgrepReturn = $this->exec($cmd, $output);
        
        if($pgrepReturn == 0) {
             $retMessage = "0"; //"Channel scan is still running"
        }
        elseif($pgrepReturn == 1)  {
            $retMessage = "1"; //"Channel Scan is not active"
        }
        else {
            throw new OMVException(OMVErrorMsg::E_EXEC_FAILED, $cmd, implode("\n", $output));
        }

        return $retMessage;

    }

}
// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance(); // Get the "root" instance for the Services 
$rpcServiceMgr->registerService(new OMVRpcServiceVDRPlugin()); // Register a new instance of the RPC service described above
?>
