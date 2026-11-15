# Dog Barn Yorkshire — Shopify theme

A modern-luxury Online Store 2.0 theme built around Dog Barn Yorkshire's existing brand: slate, stone and cream, the cream logo on a dark header, serif headlines and the countryside photography already in the store. Products, orders, customers and checkout stay in Shopify exactly as they are now.

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
| Regroup the main menu | Content → Menus | The header shows top-level links in one row. The current menu has too many to fit, so the theme falls back to a menu button on desktop. Grouping into about eight parents (Dachshund, Fleeces & jackets, Harnesses, Collars & leads, Leather, Accessories, Colourways, Our story) gives the full dropdown navigation. |
| Add real reviews | Theme editor → Customer reviews | Paste genuine reviews into the review blocks, or add your Trustpilot widget as an app block. Empty review blocks never appear on the live store. |
| Check the review score | Theme settings → Reviews and trust | Defaults to “4.9 Excellent on Trustpilot”, as shown on the current site. Keep it in line with your live profile and add the profile link. |
| Upload customer videos | Theme editor → Customer videos | Add vertical 9:16 clips to each block (Shopify-hosted). Until then the blocks show photos. Link a product to each for “shop the look”. |
| Choose a size guide page | Theme editor → Product → Size guide page | Adds a “Size guide” link beside the size options that opens in a slide-out panel. |
| Tune the swatch colours | Theme editor → Shop by colourway | The swatch colours are approximations. Adjust them, or add a fabric close-up to each. |
| Confirm the Klarna line | Theme settings → Reviews and trust | “Pay in 3 interest-free payments with Klarna.” shows under product prices. Edit or clear it to match what your checkout offers. |
| Award logo | Theme editor → Award | Shows a laurel emblem by default. Upload the official finalist badge if you have permission to use it. |
| Filters | Shopify Search & Discovery app | Enables the filter panel on collection pages. |

## What's in it

**Trust** — rotating announcement bar with review score, trust badge strip, award section, review score in the hero, product page and footer, product-page trust badges, secure checkout and payment icons, free-delivery progress in the bag.

**Reviews** — a reviews section with score summary, review cards (stars, headline, text, customer, photo, linked product) and support for review-app blocks.

**Customer videos** — a carousel of vertical clips that play silently as they scroll into view and open in a full-screen viewer with sound, progress bar, previous/next and a “shop the look” link.

**Shopping** — full-width dropdown navigation with collection imagery, live search suggestions, shop by category and by colourway, size tiles that strike through sold-out sizes, slide-out size guide, sticky add-to-bag bar, slide-out bag.

**Motion** — hero slow zoom, staggered section reveals, curtain image reveals, scrolling text band, header that tucks away on the way down and returns on the way up, cross-page fades. Everything respects the visitor's reduced-motion setting and can be switched off in Theme settings → Layout and motion.

## Notes

- Fonts default to Playfair Display (headings) and Josefin Sans (body, the brand's current font). Change them in Theme settings → Typography.
- The free-delivery bar counts the whole bag. Because free delivery applies to dog accessories only, the bag shows that caveat beside it.
- The theme assumes Shopify's current hosted customer accounts.
