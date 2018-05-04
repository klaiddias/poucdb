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

        var localDB = 'crypto_db';

    		var remoteDB = 'http://207.246.115.175:5984/crypto_db';

        //PouchDB.debug.disable();
        //PouchDB.debug.enable('*');
        PouchDB.debug.enable('pouchdb:find');

        var localDB = new PouchDB('crypto_db');

    		this.sync_db(remoteDB, localDB);
        //PouchDB.replicate(remoteDB, remoteDB);

        localDB.info().then(function (info) {
          console.log(info);
        })

        /*
        localDB.createIndex({
          index: {
            fields: ['_id','name','symbol'],
          }
        }).then((result) => {
          return localDB.find({
            selector: {
              $and: [
                { symbol: {'$eq': 'BTC'} }
              ]
            },
            fields: ['symbol'],
            sort: ['symbol']
          }
        )});
        */
/*
        localDB.createIndex({
          index: {
            fields: ['full_name','name','symbol']
          }
        }).then(function (result) {
          localDB.find({
            selector: {full_name: {$regex: ".*bit.*"}}
          }).then(function (docs) {
            console.log(docs.docs.map(function(doc) { return doc.full_name }).join(', '));
          }).catch(function (err) {
            console.log('find err: ' + err);
          });
        }).catch(function (err) {
          console.log('createIndex err: ' + err);
        });
*/

localDB.query(function (doc, emit) {
  emit(doc.full_name);
}, {key: '(?i)bit.*'}).then(function (result) {
  console.log(result);
}).catch(function (err) {
  // handle any errors
});

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        var sqlLiteElement = parentElement.querySelector('.sqlLiteElement');

        if (!!window.sqlitePlugin) {
          sqlLiteElement.setAttribute('style', 'display:block;');
        }

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    sync_db: function (remoteDB, localDB) {
      //syncDom.setAttribute('data-sync-state', 'syncing');
      var opts = {live: true, retry: true};
      //localCouch.replicate.to(remoteCouch, opts, syncError);
      //localCouch.replicate.from(remoteCouch, opts);
      //PouchDB.replicate(remoteCouch, localCouch, opts)

      localDB.replicate.from(remoteDB).on('complete', function(info) {
      console.log('complete: replicate');

      // then two-way, continuous, retriable sync
      localDB.sync(remoteDB, opts)
        .on('sync change', function (info) {
          console.log('change:' + info);
        }).on('sync paused', function (err) {
          console.log('paused:' + err);
        }).on('sync active', function () {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log('active');
        }).on('sync denied', function (err) {
          // a document failed to replicate (e.g. due to permissions)
          console.log('denied:' + err);
        }).on('sync complete', function (info) {
          // handle complete
          console.log('sync complete:' + info);
        }).on('error', function (err) {
          // handle error
          console.log('sync error:' + err);
        });
      });
    }
  }
app.initialize();
