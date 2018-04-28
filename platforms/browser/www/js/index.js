/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
		
		var localCouch = new PouchDB('crypto_db');
		var remoteCouch = 'http://devhome:janela00@207.246.115.175:5984/crypto_db';
		this.sync_db(remoteCouch, localCouch);
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	sync_db: function (remoteCouch, localCouch) {
	  //syncDom.setAttribute('data-sync-state', 'syncing');
	  var opts = {live: true, retry: true};
	  //localCouch.replicate.to(remoteCouch, opts, syncError);
	  //localCouch.replicate.from(remoteCouch, opts);
	  //PouchDB.replicate(remoteCouch, localCouch, opts)
	localCouch.replicate.from(remoteCouch).on('complete', function(info) {
	  // then two-way, continuous, retriable sync
	  localCouch.sync(remoteCouch, opts)
		.on('change', function () {alert('change');})
		.on('paused', function () {alert('paused');})
		.on('error', function () {alert('error 1');});
	}).on('error', function () {alert('error 2');});	  
	}	
};

app.initialize();