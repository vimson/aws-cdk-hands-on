const s3EventInput = {
  Records: [
    {
      eventVersion: "2.1",
      eventSource: "aws:s3",
      awsRegion: "eu-west-2",
      eventTime: "2022-07-26T15:17:38.733Z",
      eventName: "ObjectRemoved:DeleteMarkerCreated",
      userIdentity: {
        principalId: "A15Z716HL3CTQF",
      },
      requestParameters: {
        sourceIPAddress: "82.47.215.141",
      },
      responseElements: {
        "x-amz-request-id": "NKXZQ48N60X57YFM",
        "x-amz-id-2":
          "WTb1g/fq5DQ44kzCHmgp9hpLRGiH0M5pqe63jCCOBNsXWOOGcUIpnVb2UbEBiqt3haQAgqtoi4Lb1fu9XXBQ2K7UjcN6xJag",
      },
      s3: {
        s3SchemaVersion: "1.0",
        configurationId: "NDY3NzRlZTktNTMxYS00NDc2LWJlMGMtYzMyYzRjNTQ1YTFl",
        bucket: {
          name: "cdkstack-images9bf4dcd5-1aa5jb5bsqesz",
          ownerIdentity: {
            principalId: "A15Z716HL3CTQF",
          },
          arn: "arn:aws:s3:::cdkstack-images9bf4dcd5-t6856r1875qr",
        },
        object: {
          key: "tell_no_one.jpeg",
          eTag: "d41d8cd98f00b204e9800998ecf8427e",
          versionId: "dmi58L.Ywl1pl1a4zerR2nNYMfB.eSI.",
          sequencer: "0062E00592B5852B91",
        },
      },
    },
  ],
};

export { s3EventInput };
