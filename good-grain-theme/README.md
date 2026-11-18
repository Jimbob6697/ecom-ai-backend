# Good Grain — Shopify theme

An Online Store 2.0 theme for Good Grain: elegant, a little playful, and built around the colour of each jar's label.

## Install

1. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file** and choose `dist/good-grain-theme.zip`.
2. Click **Customize** to preview it as a draft. Nothing changes on the live store until you press **Publish**.

The templates already point at your existing collections (`overnight-oats`, `chia-puddings`, `bundles`), products and uploaded logo files, so the home page fills itself in.

## Label colours

Product cards, the home page hero and every product page take the colour of the jar's label. The colour is found in this order:

1. **Product metafield** `custom.label_colour` (type: Colour). Add it under Settings → Custom data → Products, then set it on any product.
2. **Theme settings → Label colours**: a list with one `product-handle: #hex` per line. It ships filled in for the current range, read from your product photos.
3. **Automatic**: with neither of the above, the colour is read from the middle of the product's first photo in the visitor's browser. This works for the standard jar shots; lifestyle photos (bundles) fall back to the navy brand colour.

So a new flavour works with no setup, and you can correct any colour in either place.

Text on top of the colour switches between cream and navy automatically so it stays readable on light labels such as Pistachio.

## Home page sections

- **Hero with jars** — up to five jars float beside the headline; the background drifts through each jar's colour. Add *Jar* blocks to choose the products. Use photos with a transparent background.
- **Into the jar** — as the visitor scrolls, each ingredient falls into the jar and adds a layer, then the lid goes on. Each *Ingredient* block has a name, a line of text, an illustration (or your own cut-out photo) and a layer colour. Pick a product to match the jar's label to it. Visitors who prefer reduced motion see a simple list instead.
- **Scrolling text**, **Featured collection**, **Image with text**, **Reviews**, **As seen in**, **Statement**, **Newsletter** — all editable in the theme editor.

## Product page

- The whole page, header included, is tinted in the label colour; the add to basket button and the scrolling flavour band use it at full strength.
- **Protein and fibre bubbles** come from the metafields `custom.protein` and `custom.fibre` (numbers, in grams). When those are empty, figures written in the description such as "7.8g protein" are used.
- `custom.ingredients` and `custom.nutrition` (text or rich text) appear as "What's inside" and "How it's good for you" rows when filled in.
- **Goes well with** shows the product's complementary products from Shopify's Search & Discovery app, or products from the fallback collection chosen in the section settings.
- Trust badges, collapsible rows and a featured review are blocks you can add, edit and reorder.

## Reviews

The review blocks hold the four customer quotes from the current site. Empty review blocks are never shown on the live store. To show a review score in the header and on product pages, fill in **Theme settings → Reviews and trust**.

## Fonts

Fraunces (headings), Josefin Sans (labels and buttons) and Poppins (text) are open-licence fonts shipped with the theme. Untick **Theme settings → Typography → Use the brand fonts** to pick others from Shopify's library.

## Free delivery bar

The basket's free delivery progress bar is off by default. Set a threshold in **Theme settings → Cart** to turn it on.
