# Setup Guide

## 1. Create a GitHub App

Go to **GitHub Settings → Developer settings → GitHub Apps → New GitHub App**.

Or use the shortcut: [github.com/settings/apps/new](https://github.com/settings/apps/new)

### Required settings

| Field               | Value                                             |
| ------------------- | ------------------------------------------------- |
| **GitHub App name** | `pforge-your-repo` (must be unique across GitHub) |
| **Homepage URL**    | Your site URL                                     |
| **Webhook URL**     | Your site URL (or leave blank)                    |
| **Webhook secret**  | Leave blank                                       |

### Permissions

Under **Repository permissions**:

| Permission  | Access       |
| ----------- | ------------ |
| Issues      | Read & write |
| Discussions | Read-only    |

Under **Subscribe to events**:

- [x] Issues
- [x] Issue comment

### Where can this GitHub App be installed?

Select **Only on this account** (recommended for personal use) or **Any account** (if you plan to share it).

Click **Create GitHub App**.

---

## 2. Generate a private key

After creating the app, scroll to **Private keys** and click **Generate a private key**.

A `.pem` file will download automatically. Keep it safe.

---

## 3. Install the app on your repository

In the left sidebar, click **Install App**. Select your account, then choose the repository you want to connect.

Click **Install**.

---

## 4. Add credentials to `.env`

Create or edit `.env` in your project root:

```bash
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
```

- `GITHUB_APP_ID`: found on your GitHub App settings page
- `GITHUB_PRIVATE_KEY`: open the downloaded `.pem` file and copy the entire content. Replace actual newlines with `\n` so it fits on one line inside the quotes.

---

## 5. Restart your server

SvelteKit reads `.env` at startup. Restart the dev server:

```bash
bun run dev
```

---

## 6. Verify the connection

Open your admin page. The status card should show:

- ✅ GitHub Connected
- App ID: `123456`

If it shows "GitHub App not configured", double-check your `.env` file and restart the server.

---

## Troubleshooting

**"GitHub App not configured" persists after adding `.env`**

- Make sure the server was restarted after editing `.env`
- Check that `GITHUB_APP_ID` contains only numbers
- Verify `GITHUB_PRIVATE_KEY` is properly quoted and newlines are escaped as `\n`

**App cannot access repository issues**

- Go to your GitHub App settings → Install App
- Ensure the app is installed on the correct repository
- Check that the "Issues" permission is set to "Read & write"
