=== BuildrStudio AI Agent ===
Contributors: adityakmr7
Tags: chatbot, ai chatbot, customer support, live chat, lead generation
Requires at least: 5.8
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add your BuildrStudio AI agent to your WordPress site. Paste your agent ID and API key, and the chat widget shows up on every page.

== Description ==

BuildrStudio sells pre-built AI agents for businesses: a support agent that answers from your own docs, FAQs and website, and hands the conversation to you when it can't help.

This plugin is the WordPress way to install one. It adds the BuildrStudio chat widget to your site's footer. You don't need to edit your theme or paste code.

**What you need**

* A BuildrStudio account and an agent: a free trial or a paid plan, from [buildrstudio.in](https://buildrstudio.in).
* Your agent ID and API key. Both are in the embed code on your BuildrStudio dashboard.

**What the plugin does**

* Loads the widget script in the footer of every front-end page.
* Lets you override the greeting, brand colour and widget position for this site. If you leave them blank, it uses what you saved in the BuildrStudio dashboard.
* Stores one option in your database and removes it when you delete the plugin.

Training the agent, reading conversations and managing leads all happen in your BuildrStudio dashboard, not in WordPress.

== External services ==

This plugin connects your site to the BuildrStudio service, which runs the AI agent.

* **What is loaded:** the widget script from `https://buildrstudio.in/widget.js`, on every front-end page, once you enter an agent ID and API key and leave "Show widget" on.
* **What is sent, and when:**
    * When the widget loads, it requests your widget settings (greeting, colour, position) from `https://buildrstudio.in/api/v1/config` using your public API key.
    * When a visitor sends a chat message, the message, a chat session ID and the page URL go to `https://buildrstudio.in/api/v1/chat` so the agent can reply.
    * If a visitor fills in the contact form in the widget, the name, email, phone number and message they enter go to `https://buildrstudio.in/api/v1/leads`.
* Nothing is sent until a visitor's browser loads the widget. The plugin makes no server-side requests from WordPress.
* Service provider: BuildrStudio. [Terms of service](https://buildrstudio.in/terms) · [Privacy policy](https://buildrstudio.in/privacy)

== Installation ==

1. Upload the `buildrstudio` folder to `/wp-content/plugins/`, or go to Plugins → Add New → Upload Plugin and choose the zip.
2. Activate **BuildrStudio AI Agent**.
3. Go to **Settings → BuildrStudio**.
4. Paste the agent ID (`data-agent-id`) and API key (`data-key`) from the embed code on your BuildrStudio dashboard.
5. Save, then open your site. The chat bubble appears in the corner.

== Frequently Asked Questions ==

= Where do I find my agent ID and API key? =

On your BuildrStudio dashboard, in the embed code for your agent. The agent ID is the `data-agent-id` value, for example `support-agent-starter`. The API key is the `data-key` value and starts with `pk_live_`.

= Is it safe to put the API key here? =

Yes. It's a public key meant to sit in your page source, just like the embed code does. It only works with your agent and is rate limited.

= The widget doesn't show up. =

Check that "Show widget" is ticked and both fields are filled in. If you use a caching or JavaScript-optimisation plugin, clear its cache. If it "delays" or "combines" scripts, exclude `buildrstudio.in/widget.js`.

= Can I change the colour or greeting? =

Yes. Change them in your BuildrStudio dashboard; that also applies anywhere else you use the agent. Or set a per-site override on the settings page.

= Does it work with page builders? =

Yes. The widget is added to the page footer, so it doesn't depend on your theme or page builder.

== Screenshots ==

1. Settings → BuildrStudio: connect your agent and optionally override its look.

== Changelog ==

= 1.0.0 =
* First release: settings page, footer embed, appearance overrides, clean uninstall.

== Upgrade Notice ==

= 1.0.0 =
First release.
