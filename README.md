openbiz-appbuilder
==================

Generate an Openbiz Application structure
----------------------
appbuilder  -c examples/testApp.json -o ../../apps/test



Generate an Openbiz Module structure
----------------------
appbuilder  -c examples/testModule.json -o ../../apps/test


Installation
------------------
You can link the appbuilder script to system bin folder
APPBUILDER_DIR=/Users/jixian/Workspace/VogdataProjects/server/node_modules/openbiz-appbuilder
ln -s ${APPBUILDER_DIR}/bin/appbuilder /usr/local/bin/appbuilder