# BuildrStudio WordPress plugin

`buildrstudio/` is a GPL-2.0-or-later WordPress plugin that adds the BuildrStudio chat widget
(`https://buildrstudio.in/widget.js`) to a site's footer.

- **Settings → BuildrStudio**: agent ID (`data-agent-id`), API key (`data-key`), an on/off switch,
  and optional greeting / colour / position overrides. The overrides are written as
  `window.BuildrAgentConfig` before the script tag. Blank fields fall back to the dashboard config
  served by `/api/v1/config`.
- Uses the Settings API, so the form has a nonce and a `manage_options` check. Every input is
  sanitised (slug/key regex, `sanitize_hex_color`, whitelisted position) and all output is escaped.
- `uninstall.php` deletes the single `buildrstudio_settings` option, on every site of a multisite.
- For staging, the `buildrstudio_widget_src` filter changes the script URL.

## Building the zip

```bash
npm run zip:wordpress        # writes public/downloads/buildrstudio-wordpress.zip
npm run check:wordpress-zip  # fails if the committed zip doesn't match the source
```

The zip is committed and served as a static file at `/downloads/buildrstudio-wordpress.zip`, which
is linked from the homepage install section and the dashboard. Output is deterministic, so rebuild
and commit it whenever the plugin changes.

## Checks

- `php -l buildrstudio.php uninstall.php`
- The WordPress [Plugin Check](https://wordpress.org/plugins/plugin-check/) plugin:
  `wp plugin check buildrstudio`

## Submitting to WordPress.org

1. Make sure `Contributors:` in `readme.txt` is the WordPress.org username that will own the plugin.
2. Upload the zip at https://wordpress.org/plugins/developers/add/ and wait for review.
3. Once approved, commit the plugin to the SVN repo you're given: `trunk/` plus a `tags/1.0.0/` copy.
   Add a screenshot (`assets/screenshot-1.png`) of the settings page.
4. Bump `Version` in `buildrstudio.php` and `Stable tag` in `readme.txt` together on every release.
