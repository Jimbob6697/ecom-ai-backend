# Ruby Hammer — Shopify theme

An Online Store 2.0 theme for Ruby Hammer Beauty: elegant and calm, easy to read, and built to convert on the product page.

## Install

1. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file** and choose `dist/ruby-hammer-theme.zip`.
2. Click **Customize** to preview it as a draft. Nothing changes on the live store until you press **Publish**.

The templates point at your existing collections (`bestsellers`, `cheeks`, `lips`, `eyes`, `tools`, `gift-sets`), your `news` blog, and the logo, portrait and press-logo files already uploaded to your store.

## Designed for easy reading

- Body text is 17px and nothing on the site is smaller than 13px.
- Near-black text on warm white; ruby is used for emphasis and buttons.
- Buttons and form fields are at least 54px tall, with clear focus outlines for keyboard users.
- Motion is gentle and is switched off for visitors who ask their device to reduce it.

## Product page

- **Review rating** beside the title, read from the rating your reviews app saves on each product (the standard `reviews.rating` and `reviews.rating_count` metafields that Judge.me, Shopify Product Reviews, Okendo and others fill in). It links down to the reviews. Products with no reviews show nothing.
- **Reviews widget**: in the theme editor open a product page, find the **Apps** section under the product and add your review app's block to it.
- **Shades** are shown as large labelled swatches. They use the swatch colour or image set on the option value in Shopify; without one, the photo of the first variant in that shade.
- **Free delivery message** under the button: "Spend £X more for free UK delivery", counting what is already in the bag, and updating with the chosen shade and quantity. Set the amount in **Theme settings → Cart** (£35 by default; 0 turns it off).
- **Pairs well with**: uses each product's *complementary products* from Shopify's free **Search & Discovery** app. Until those are set it shows products from the fallback collection chosen in the Product section (Bestsellers by default). Each row has a one-tap Add.
- **Trust badges**, **collapsible rows** and a **featured review** are blocks you can add, edit and reorder.
- **Ruby's tip**: a short quote in Ruby's own words. Add the text in the block, or per product in a `custom.ruby_tip` metafield. It is hidden until text is added.
- Optional metafields: `custom.subtitle` (a line under the title), `custom.how_to_use` and `custom.ingredients` (their own rows under the description).
- A sticky add-to-bag bar appears once the main button scrolls out of view.
- Sets show the saving as a percentage.

## Bag

The slide-out bag has a free delivery progress bar and its own "Pairs well with" row. Choose the collection it draws from in **Theme settings** (cart drawer section).

## Home page

Hero, press logos, bestsellers, shop by category, Ruby's story, reviews, feature tiles, gifts and sets, statement, trust points, blog posts, Buy Women Built and newsletter. Every section can be edited, reordered or hidden in the theme editor.

The three customer quotes are the ones on the current home page. Empty review blocks are never shown on the live store.

## Header

On larger screens the logo sits on its own line with the menu centred beneath it. If the menu has more links than fit, it becomes a menu button automatically.

## Fonts

Cormorant Garamond (headings) and Jost (everything else, as on the current site) are open-licence fonts shipped with the theme. Untick **Theme settings → Typography → Use the brand fonts** to pick others from Shopify's library.
