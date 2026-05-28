-- Migration 006: Book reviews table

CREATE TABLE IF NOT EXISTS book_reviews (
  id            SERIAL PRIMARY KEY,
  book_id       INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         VARCHAR(200),
  body          TEXT NOT NULL,
  review_date   DATE,
  verified      BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id, display_order);

-- Seed reviews (only if table is empty to stay idempotent)
DO $$
DECLARE
  b1 INTEGER;
  b2 INTEGER;
BEGIN
  IF (SELECT COUNT(*) FROM book_reviews) = 0 THEN

    SELECT id INTO b1 FROM books WHERE display_order = 1 LIMIT 1;
    SELECT id INTO b2 FROM books WHERE display_order = 2 LIMIT 1;

    -- ── Book 1: Regroup Refocus Rebuild ──────────────────────────────────────
    INSERT INTO book_reviews (book_id, reviewer_name, rating, title, body, review_date, verified, display_order)
    VALUES
    (
      b1, 'P. Badobre', 4,
      'Practical Tools for Real Families',
      'Regroup. Refocus. Rebuild provides tools for raising well balanced kids in not so perfect circumstances. I do not think one needs to be divorced or be a single parent to find this book useful. I enjoyed every bit of it and got some useful tools to help communicate better with my children. The sincerity in the writing is palpable.',
      '2017-03-12', true, 1
    ),
    (
      b1, 'M. Nasah', 5,
      'A Must-Read for Anyone Navigating Family Transition',
      'Natalie Cabinda writes with the wisdom of an educator and the heart of a mother. This book is not just for people going through divorce — it is for anyone who has had to rebuild their life. The practical strategies are grounded and actionable, and the compassion on every page is unmistakable. Highly recommend.',
      '2017-05-04', true, 2
    ),
    (
      b1, 'Verified Purchaser', 5,
      'Changed My Perspective as a Single Parent',
      'I bought this book during one of the lowest points of my life and it met me exactly where I was. The chapters on communication with children during and after divorce are worth the price alone. Natalie draws on her 18+ years of educational experience to deliver advice that is concrete, compassionate, and real.',
      '2018-01-22', true, 3
    ),
    (
      b1, 'Amazon Customer', 5,
      'Honest, Heartfelt, and Exactly What I Needed',
      'What sets this book apart is its spiritual grounding. Natalie does not just give practical advice — she gives hope. As someone who felt completely lost after my divorce, this book reminded me that rebuilding is not only possible, it is the path forward. I have recommended it to every single parent I know.',
      '2018-09-15', false, 4
    ),
    (
      b1, 'Book Club Member', 4,
      'An Excellent Resource for Our Parenting Support Group',
      'We used this book as the centerpiece of our single parent support group and it sparked the most meaningful conversations we have had. The author speaks from both professional expertise and lived experience, which makes the guidance feel trustworthy and accessible. A valuable addition to any parenting library.',
      '2019-02-08', true, 5
    );

    -- ── Book 2: Their Gods Were Watching Me ──────────────────────────────────
    INSERT INTO book_reviews (book_id, reviewer_name, rating, title, body, review_date, verified, display_order)
    VALUES
    (
      b2, 'Amazon Customer', 5,
      'A Journey Worth Reading',
      'Natalie Cabinda writes with raw honesty about her roots and the resilience that carried her through extraordinary challenges. This memoir stays with you long after the last page. The way she traces her journey from her cultural origins to single motherhood in America is both deeply personal and universally relatable. Deeply moving.',
      '2016-12-03', false, 1
    ),
    (
      b2, 'Verified Purchaser', 5,
      'Powerful and Deeply Moving',
      'I was not prepared for how profoundly this memoir would affect me. Natalie''s story of faith, identity, and survival is told with remarkable authenticity and courage. A must-read for anyone who has had to find strength they did not know they had, or who has ever felt caught between two worlds.',
      '2017-02-19', true, 2
    ),
    (
      b2, 'T. Okafor', 5,
      'A Testimony of Resilience and Faith',
      'This memoir beautifully captures what it means to persevere against all odds. Natalie''s cultural heritage and faith weave through every chapter, creating a narrative that honors where she came from while charting a courageous path forward. Her story is a gift to anyone carrying a heavy load.',
      '2017-06-11', true, 3
    ),
    (
      b2, 'Book Reviewer', 4,
      'Rich, Cultural, and Deeply Inspiring',
      'The way Natalie weaves her African roots into her personal story of single motherhood is masterful. This is the kind of memoir that makes you appreciate both where you come from and where you are going. The writing is intimate and graceful, and the story it tells is one of extraordinary strength.',
      '2018-03-27', false, 4
    ),
    (
      b2, 'Verified Purchaser', 5,
      'Faith, Family, and the Courage to Rebuild',
      'Their Gods Were Watching Me is a powerful account of one woman''s journey through life''s greatest trials. Natalie''s faith and her fierce love for her children shine through on every page. This is not just a memoir — it is a testimony. It left me inspired and grateful.',
      '2018-08-14', true, 5
    );

  END IF;
END;
$$;
