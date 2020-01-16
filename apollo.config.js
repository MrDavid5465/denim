module.exports = {
  client: {
    name: "typiQL",
    service: {
      name: "typiQL",
      url: "http://aph141671d/genericAPI/api/GraphQL",
      headers: {
        authorization:
          "NTLM TlRMTVNTUAADAAAAGAAYAIQAAAAYABgAnAAAABIAEgBIAAAAFgAWAFoAAAAUABQAcAAAAAAAAAC0AAAABYKIogUBKAoAAAAPQQBIAFUALgBPAE4ALgBDAEEAZABhAHYAaQBkAF8AcwBjAG8AdAB0AEEAUABIADEANAAxADYANwAxAEQA+7gTSdlguLsAAAAAAAAAAAAAAAAAAAAA1PCNQJEMEcQz6NsrIVzjSDDp6gBMAZao"
      },
      skipSSLValidation: true
    },
    tagName: "gql",
    includes: "**/*.tsx",
    excludes: "node_modules/*"
  }
};
