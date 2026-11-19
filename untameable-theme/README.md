# Untameable — Shopify theme

An Online Store 2.0 theme for a single hero product. Bold type in three brand colours, with the proof stacked up: reviews, before and after, the formula, customer photos and FAQs.

## Install

1. In Shopify admin go to **Online Store → Themes → Add theme → Upload zip file** and choose `dist/untameable-theme.zip`.
2. Click **Customize** to preview it as a draft. Nothing changes on the live store until you press **Publish**.

The templates point at your existing product (`curl-cream`), your `journal` blog, and the logo and photos already uploaded to your store.

## Heading font

Headings use your own display font, loaded from the font file already in your store's Files. The URL is in **Theme settings → Typography → Display font file URL**. If it is ever removed, the theme falls back to Archivo, an open-licence font shipped with the theme. Text is set in Manrope.

## Home page

A landing page for the product, top to bottom:

- **Hero** — huge headline, the product's real review rating beside the button, and a rotating stamp.
- **Scrolling claims**.
- **Featured product** — a buy box on the home page: pack choice with prices, add to bag, guarantee line and claims.
- **Before and after** — add a Before photo and an After photo for a drag-to-compare slider, or one ready-made side-by-side image (the default).
- **The formula** — headline facts, each key ingredient with what it does and its INCI name, and the full ingredients list.
- **Customer photos and videos** — add a video or a photo per block; tapping one opens it full screen.
- **Reviews** — real customer quotes, with the product's live rating.
- **How to use** — a video or photo beside numbered steps.
- Full-width banner, sustainability story, FAQ, journal posts and newsletter.

Every section can be edited, reordered or hidden in the theme editor, and they can all be added to other pages.

## Product page

- Review rating beside the title, linking down to the reviews.
- **Pack tiles** with each pack's price. The pack whose name contains the word in *Pack to highlight* (Duo) carries a flag such as "Free UK delivery".
- Guarantee line, short claims, secure checkout and payment icons, trust badges, a featured review and collapsible detail rows.
- A sticky add-to-bag bar once the main button scrolls out of view.
- Below the buy area: claims, before and after, the formula, how to use, a banner, your reviews app, review quotes, customer photos and FAQ.

## Reviews

- The star rating shown in the hero, buy box, product page and reviews section is read from the rating your reviews app saves on the product (the standard `reviews.rating` and `reviews.rating_count` metafields). It updates itself.
- To show the full reviews widget, open the product page in the theme editor and add your reviews app's block to the **Apps** section.
- The quotes in the Reviews section are real reviews copied from your product page. Edit or replace them in the section's blocks. Empty review blocks are never shown on the live store.

## Claims

The figures and ingredient descriptions come from your current site. Keep them in step with what you can support, and with your returns policy where the guarantee is mentioned.
