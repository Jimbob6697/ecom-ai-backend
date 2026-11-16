# Dog Barn Yorkshire — Shopify theme

A minimal, gallery-style Online Store 2.0 theme for Dog Barn Yorkshire, styled to the brand guide: the Midnight, Bark, Beige, Lawn and White palette, Big Caslon headings, Nord labels and Poppins Light text. Square edges, edge-to-edge photography, split navigation around a centred logo, a two-up category grid, tight product rows and an image-grid product page. Products, orders, customers and checkout stay in Shopify exactly as they are now.

## Install

1. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**.
2. Upload `dist/dog-barn-yorkshire-theme.zip`.
3. **Customize** to review it, then **Publish**. Your current theme stays in the library as a fallback.

Rebuild the zip after editing files with `npm run theme:zip:dogbarn`.

## Already wired to the store

The default content points at things that already exist in the Dog Barn Yorkshire store, so it should look populated on first preview:

- **Images** — the logo, hero and lifestyle shots are referenced from *Content → Files* by filename (for example `Bnner10.png`). If a file has been renamed or removed, that slot shows a placeholder until you pick an image.
- **Collections** — category tiles, product rows and colourway swatches use the current collection handles (`sherpa-jacket`, `dachshund-collections`, `best-sellers`, `chestnut-trail-brown`, and so on).
- **Menus** — the header uses *Main menu*, the footer uses *Main menu* and *Footer*.
- **Copy** — delivery prices and times, the returns summary, washing advice, the award and the story text are taken from the current site.

## To do before publishing

| What | Where | Why |
| --- | --- | --- |
| Set up the two header menus | Content → Menus, then Theme editor → Header | Navigation sits either side of the centred logo. Use up to five grouped links on the left (for example Dog Wear, Dachshund, Harnesses, Collars & Leads, Leather) and create a short second menu for the right (for example Colourways, Our Story). The current main menu has too many top-level links, so until it is regrouped the theme shows a menu button on desktop instead. |
| Add real reviews | Theme editor → Customer reviews | Paste genuine reviews into the review blocks, or add your Trustpilot widget as an app block. Empty review blocks never appear on the live store. |
| Check the review score | Theme settings → Reviews and trust | Defaults to “4.9 Excellent on Trustpilot”, as shown on the current site. Keep it in line with your live profile and add the profile link. |
| Upload customer videos | Theme editor → Customer videos | Add vertical 9:16 clips to each block (Shopify-hosted). Until then the blocks show photos. Link a product to each for “shop the look”. |
| Choose a size guide page | Theme editor → Product → Size guide page | Adds a “Size guide” link beside the size options that opens in a slide-out panel. |
| Tune the swatch colours | Theme editor → Shop by colourway | The swatch colours are approximations. Adjust them, or add a fabric close-up to each. |
| Confirm the Klarna line | Theme settings → Reviews and trust | “Pay in 3 interest-free payments with Klarna.” shows under product prices. Edit or clear it to match what your checkout offers. |
| Award logo | Theme editor → Award | Shows a simple ringed emblem by default. Upload the official finalist badge if you have permission to use it. |
| Filters | Shopify Search & Discovery app | Enables the filter panel on collection pages. |

## What's in it

**Trust** — rotating announcement bar with review score, a “Why Dog Barn” trust band, award band, product-page trust badges, secure checkout and payment icons, free-delivery progress in the bag.

**Reviews** — a reviews section with a large score on one side and one review at a time on the other (stars, headline, text, customer, photo, linked product), plus support for review-app blocks.

**Customer videos** — a carousel of vertical clips that play silently as they scroll into view and open in a full-screen viewer with sound, progress bar, previous/next and a “shop the look” link.

**Shopping** — split navigation with full-width dropdowns, live search suggestions, a full-bleed category grid, shop by colourway, an image-grid product page with a sticky details column, size squares that strike through sold-out sizes, slide-out size guide, sticky add-to-bag bar, slide-out bag.

**Motion** — hero images that ease in and drift on scroll, sections that fade up as they arrive, slow image zoom on hover, underlines that draw across links, a header that slides away on the way down and returns on the way up, and cross-page fades. Everything respects the visitor's reduced-motion setting and can be switched off in Theme settings → Layout and motion.

## Notes

- Fonts: headings use Big Caslon Medium, labels and buttons use Nord Medium, and text uses Poppins Light, as set out in the brand guide. Poppins is open-licence and is bundled. **Big Caslon and Nord are licensed fonts and are not included**: until their web font files are added, the theme shows close stand-ins (Libre Caslon Display and Lexend Giga). To switch to the real fonts, upload the licensed `.woff2` files under Content → Files, then paste each file's URL into Theme settings → Typography.
- Logo: the header is white and the current logo file is cream, so the header setting “Tint the logo to the text colour” recolours it to Midnight automatically. Untick it if you upload a dark logo. The footer shows the logo in its original cream on Bark.
- Colours follow the brand guide: White background, Midnight (#425563) for text, buttons and dark sections, Bark (#6F6259) for the footer and secondary text, Beige (#D2CCBE) for the announcement bar with a lighter tint of it behind product photos and quiet bands, and Lawn (#6F755C) for review stars, “New” labels and accent sections such as the award band. Each role can be changed in Theme settings → Colours.
- Photography: the minimal look is at its best with clean, consistent product shots on a plain background. The current lifestyle photos work, but studio-style images on light grey would lift the product grid further.
- The free-delivery bar counts the whole bag. Because free delivery applies to dog accessories only, the bag shows that caveat beside it.
- The theme assumes Shopify's current hosted customer accounts.
