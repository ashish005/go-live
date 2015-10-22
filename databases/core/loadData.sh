mongo < rmCollections.scr
mongoimport -d goLive -c core --jsonArray < default-json-files/core.json
mongo < updateInfo.scr

echo  ######################  TEST DATA CHANGES   ########################
mongo < testChanges.scr