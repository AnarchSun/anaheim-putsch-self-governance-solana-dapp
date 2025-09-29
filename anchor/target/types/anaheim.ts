/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anaheim.json`.
 */
export type Anaheim = {
  "address": "32GxU3uyDqcTn99CnFbbBwQujuCLy9mNwkf6MYqQYHC9",
  "metadata": {
    "name": "anaheim",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "post",
          "writable": true,
          "signer": true
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
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
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
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
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
      "name": "alreadyVoted",
      "msg": "User has already voted."
    },
    {
      "code": 6001,
      "name": "invalidContent",
      "msg": "Invalid content."
    },
    {
      "code": 6002,
      "name": "contentTooLong",
      "msg": "Content too long."
    },
    {
      "code": 6003,
      "name": "usernameTooLong",
      "msg": "Username too long."
    },
    {
      "code": 6004,
      "name": "invalidUsername",
      "msg": "Invalid username."
    },
    {
      "code": 6005,
      "name": "usernameTooShort",
      "msg": "Username too short dude!"
    },
    {
      "code": 6006,
      "name": "overflow",
      "msg": "Overflow occurred."
    },
    {
      "code": 6007,
      "name": "underflow",
      "msg": "Underflow occurred."
    },
    {
      "code": 6008,
      "name": "usernameExists",
      "msg": "Username already exists."
    },
    {
      "code": 6009,
      "name": "unauthorized",
      "msg": "Unauthorized action."
    },
    {
      "code": 6010,
      "name": "invalidAuthority",
      "msg": "Invalid authority on post."
    },
    {
      "code": 6011,
      "name": "missingBump",
      "msg": "Bump not found in context."
    },
    {
      "code": 6012,
      "name": "emptyContent",
      "msg": "Empty Content."
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
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
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
