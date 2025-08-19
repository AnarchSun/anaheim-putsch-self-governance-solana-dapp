/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anaheim.json`.
 */
export type Anaheim = {
  "address": "DWiMeBh6xzNMCZq5eW7u67NRNaCkvGaQczcJSzpF5mC9",
  "metadata": {
    "name": "anaheim",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createStake",
      "discriminator": [
        201,
        134,
        55,
        171,
        2,
        136,
        228,
        226
      ],
      "accounts": [
        {
          "name": "stakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "decrement",
      "discriminator": [
        106,
        227,
        168,
        59,
        248,
        27,
        150,
        101
      ],
      "accounts": [
        {
          "name": "base",
          "accounts": [
            {
              "name": "anaheimAccount",
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
                    "path": "authority"
                  }
                ]
              }
            },
            {
              "name": "authority",
              "signer": true,
              "relations": [
                "anaheimAccount"
              ]
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "discriminator": [
        11,
        18,
        104,
        9,
        104,
        174,
        59,
        33
      ],
      "accounts": [
        {
          "name": "base",
          "accounts": [
            {
              "name": "anaheimAccount",
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
                    "path": "authority"
                  }
                ]
              }
            },
            {
              "name": "authority",
              "signer": true,
              "relations": [
                "anaheimAccount"
              ]
            }
          ]
        }
      ],
      "args": []
    },
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
          "name": "anaheimAccount",
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
      "args": []
    },
    {
      "name": "mine",
      "discriminator": [
        59,
        22,
        178,
        213,
        139,
        197,
        160,
        196
      ],
      "accounts": [
        {
          "name": "base",
          "accounts": [
            {
              "name": "anaheimAccount",
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
                    "path": "authority"
                  }
                ]
              }
            },
            {
              "name": "authority",
              "signer": true,
              "relations": [
                "anaheimAccount"
              ]
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "set",
      "discriminator": [
        198,
        51,
        53,
        241,
        116,
        29,
        126,
        194
      ],
      "accounts": [
        {
          "name": "base",
          "accounts": [
            {
              "name": "anaheimAccount",
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
                    "path": "authority"
                  }
                ]
              }
            },
            {
              "name": "authority",
              "signer": true,
              "relations": [
                "anaheimAccount"
              ]
            }
          ]
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u64"
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
    },
    {
      "name": "stakeAccount",
      "discriminator": [
        80,
        158,
        67,
        124,
        50,
        189,
        192,
        255
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidBump",
      "msg": "This error is no longer used, but can be kept for future checks."
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
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
