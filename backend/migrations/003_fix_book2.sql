-- Fix book 2 title and description to match actual published book
UPDATE books SET
  title       = 'Their Gods Were Watching Me',
  subtitle    = 'A Memoir by Natalie Cabinda',
  description = 'A powerful memoir tracing Natalie Cabinda''s remarkable journey — from her roots to the challenges of single parenthood — and the faith, resilience, and community that carried her through. An intimate and inspiring story of perseverance, identity, and the grace that sustains us.',
  cover_image = '/images/book2-cover.jpg'
WHERE display_order = 2;
