-- Fix book cover image paths and book 2 title to match actual published books
UPDATE books SET
  cover_image = '/images/book1-cover.png'
WHERE display_order = 1;

UPDATE books SET
  title       = 'Their Gods Were Watching Me',
  subtitle    = 'A Memoir by Natalie Cabinda',
  description = 'A powerful memoir tracing Natalie Cabinda''s remarkable journey — from her roots to the challenges of single parenthood — and the faith, resilience, and community that carried her through. An intimate and inspiring story of perseverance, identity, and the grace that sustains us.',
  cover_image = '/images/book2-cover.jpg'
WHERE display_order = 2;
