mongo < rmCollections.scr
mongoimport -d goLive -c core --jsonArray < core/core.json
mongoimport -d goLive -c category --jsonArray < core/category.json

echo  ######################  TEST DATA CHANGES   ########################