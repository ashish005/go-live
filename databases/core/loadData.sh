mongo < rmCollections.scr
mongoimport -d goLive -c core --jsonArray < default-json-files/core.json
mongoimport -d goLive -c category --jsonArray < default-json-files/category.json
mongoimport -d goLive -c users --jsonArray < default-json-files/users.json
mongo < updateInfo.scr

echo  ######################  TEST DATA CHANGES   ########################
mongo < testChanges.scr