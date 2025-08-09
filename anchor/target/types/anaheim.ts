/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anaheim.json`.
 */
export type Anaheim = {
  "address": "FSyJ9EGkBerkZB6C1DSzDkcmjzohhvydb22FfQptbYQH",
  "metadata": {
    "name": "anaheim",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
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
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "user_profile.post_count",
                "account": "userAccount"
              }
            ]
          }
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
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
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
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
          "name": "username",
          "type": "string"
        }
      ]
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
          "name": "anaheimAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "anaheimAccount"
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
          "name": "anaheimAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "anaheimAccount"
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
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
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
            "name": "count",
            "type": "u64"
          },
          {
            "name": "value",
            "type": "u8"
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
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "contentLen",
            "type": "u16"
          },
          {
            "name": "content",
            "type": {
              "array": [
                "u8",
                280
              ]
            }
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "usernameLen",
            "type": "u8"
          },
          {
            "name": "username",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "postCount",
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
