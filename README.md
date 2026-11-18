# @bouncelayer/mcp

Official Model Context Protocol (MCP) server for [BounceLayer](https://bouncelayer.com/) — real-time, deterministic RFC 5321 email verification with direct TCP port 25 SMTP handshakes.

Website: [https://bouncelayer.com/](https://bouncelayer.com/)  
API Documentation: [https://bouncelayer.com/docs](https://bouncelayer.com/docs)  
Dashboard & API Keys: [https://bouncelayer.com/dashboard/api-keys](https://bouncelayer.com/dashboard/api-keys)

---

## What is BounceLayer?

[BounceLayer](https://bouncelayer.com/) is a high-speed email verification platform providing:
- Direct RFC 5321 TCP port 25 mailbox handshakes (<140ms latency)
- 100K+ daily-synced disposable / burner firewall
- Risky-address flags (role-based, disposable) & catch-all detection
- Bulk list cleaning up to 10,000 emails per batch
- Pay-as-you-go & monthly subscription credits that never expire

---

## Setup in Cursor / Claude Desktop / Windsurf

Add this to your MCP configuration file (`~/.cursor/mcp.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "bouncelayer": {
      "command": "npx",
      "args": ["-y", "@bouncelayer/mcp"],
      "env": {
        "BOUNCELAYER_API_KEY": "bl_live_your_api_key_here"
      }
    }
  }
}
```

> **Note**: Get your free API key and 300 free credits/month at [https://bouncelayer.com/](https://bouncelayer.com/).

---

## Available MCP Tools

Once installed, your AI agent has these 9 tools:

- `verify_email`: Verify single email address (RFC 5321 Port 25 SMTP handshake).
- `verify_email_demo`: Free format, typo, throwaway-domain and mail-server check, no API key needed. It never checks the mailbox, so a good address comes back `unknown`.
- `create_agent_account`: No key yet? Get your own API key with free credits and a claim link for the person you work for.
- `submit_bulk_verification`: Batch submit up to 10,000 email addresses for background processing.
- `get_bulk_job`: Inspect status and retrieved results for a bulk verification job.
- `cancel_bulk_job`: Cancel processing job and refund reserved credits.
- `list_bulk_jobs`: List your recent bulk jobs.
- `get_credit_balance`: Query remaining credits.
- `get_api_discovery`: View endpoint metadata and OpenAPI schemas.

---

## Official Links

- **Website**: [https://bouncelayer.com/](https://bouncelayer.com/)
- **Pricing & Free Credits**: [https://bouncelayer.com/pricing](https://bouncelayer.com/pricing)
- **Node SDK**: [https://www.npmjs.com/package/@bouncelayer/sdk](https://www.npmjs.com/package/@bouncelayer/sdk)
- **Support**: [support@bouncelayer.com](mailto:support@bouncelayer.com)

## License

MIT © [BounceLayer](https://bouncelayer.com/)

---

## Directory listings

`server.json` is the listing for the [official MCP Registry](https://registry.modelcontextprotocol.io). It offers both the npm package (stdio) and the hosted server at `https://api.bouncelayer.com/mcp/` with an `X-API-Key` header. `mcpName` in `package.json` matches the listing name, which the registry checks against the published npm package.

To publish (needs the npm account and the bouncelayer.com domain):

1. Publish this package to npm so the version in `package.json` (with `mcpName`) is live.
2. Install the registry CLI (`mcp-publisher`), then log in with domain verification for `com.bouncelayer` (DNS or HTTP).
3. Run `mcp-publisher publish` from this folder.

Other directories such as Smithery, Glama, PulseMCP and mcp.so have their own submission forms; the details in server.json are what they ask for.
