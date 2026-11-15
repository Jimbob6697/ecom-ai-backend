# Voltline — Shopify theme for Tesla accessories

A clean, motion-led Online Store 2.0 theme. Products, orders, customers, payments and checkout all run on Shopify; this theme is only the storefront.

## Install

1. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file**.
2. Upload `dist/voltline-theme.zip` from this repository.
3. Click **Customize** to edit it, then **Publish** when you're happy.

To rebuild the zip after editing files in `shopify-theme/`, run `npm run theme:zip` from the repository root.
For live development use the Shopify CLI: `shopify theme dev --path shopify-theme`.

## First-time setup

| What | Where | Why |
| --- | --- | --- |
| Main menu | Content → Menus → Main menu | Top-level items appear in the header. Items with nested links open the full-width flyout. |
| Footer menu | Content → Menus → Footer menu | Used for the footer "Help" column and the search quick links. |
| Vehicle tags | Tag products `Model 3`, `Model Y`, `Model S`, `Model X` or `Cybertruck` | Drives the "Fits Model 3, Model Y" line on cards and the fitment chips on product pages. Change the list in Theme settings → Product cards. |
| Model collections | Products → Collections | Create one automated collection per vehicle (condition: tag equals `Model Y`), then pick them in the home page "Shop by model" section. |
| Images | Theme editor | Hero, promo tiles, model tiles and feature cards show animated placeholder artwork until you add your own photography. |
| Filters | Install Shopify's free **Search & Discovery** app | Enables the filter panel on collection pages. |
| Free delivery bar | Theme settings → Cart | Set the threshold, or 0 to hide it. |

`shopify-theme-extras/sample-products.csv` holds eight sample products you can import under **Products → Import** to see the theme populated. They import as drafts with placeholder prices.

## Sections

Hero · Shop by model · Product shelf · Promo tiles · Scrolling statement · Feature grid · Image with text · Value props · FAQ · Email signup · Rich text · Contact form, plus product, collection, cart, search, blog, page, 404 and password templates.

## Motion

- Headline lines rise and sharpen on load; the hero scales and fades as you scroll away.
- Sections, cards and tiles reveal with a stagger as they enter the viewport.
- The statement section lights up word by word with scroll position.
- Header flyout, search panel, cart drawer and sticky buy bar all animate in.
- Cross-page fades use the View Transitions API where the browser supports it.

Everything respects the visitor's "reduce motion" setting, and each effect can be switched off in **Theme settings → Layout and motion**.

## Notes

- All copy, prices and claims in the default content are placeholders — replace them with your own.
- The theme assumes Shopify's current customer accounts (hosted by Shopify). Legacy customer account templates are not included.
- The footer carries a trademark notice stating the shop is independent of Tesla, Inc. Keep it, and avoid using Tesla logos or official imagery you don't have rights to.
