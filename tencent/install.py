import os
from yaml import load
from dotenv import load_dotenv
from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.cvm.v20170312 import cvm_client, models


load_dotenv()

secret_key = os.environ.get('KEY')
secret_id = os.environ.get('ID')

try:
    cred = credential.Credential("secretId", "secretKey")
    client = 

    req = models.DescribeInstancesRequest()
    resp = client.DescribeInstances(req)

    print(resp.to_json_string())
except TencentCloudSDKException as err:
    print(err)
