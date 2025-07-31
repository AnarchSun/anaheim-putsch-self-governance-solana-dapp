/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anaheim.json`.
 */
export type Anaheim = {
  "address": "8bCmQr6a5Fr3S3CRbXyzBKXBNnRaTLDeArfYSWevJdfA",
  "metadata": {
    "name": "anaheim",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "docs": [
    "─── PROGRAMME PRINCIPAL ────────────────────────────────────────────────────"
  ],
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "anaheim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  110,
                  97,
                  104,
                  101,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "anaheimAccount",
      "discriminator": [
        26,
        253,
        236,
        239,
        22,
        181,
        47,
        158
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "contentTooLong",
      "msg": "Content exceeds max allowable length."
    },
    {
      "code": 6001,
      "name": "usernameTooLong",
      "msg": "Username exceeds max allowable length."
    },
    {
      "code": 6002,
      "name": "invalidContent",
      "msg": "Content is invalid (empty or whitespace only)."
    }
  ],
  "types": [
    {
      "name": "anaheimAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "value",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "voteCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
