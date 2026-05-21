-- Seed data for RRR website

-- Books
INSERT INTO books (title, subtitle, description, author, price, amazon_url, cover_image, is_signed, signed_price, in_stock, display_order) VALUES
(
  'Regroup Refocus Rebuild',
  'A Guide for Single Parents Navigating Life After Divorce',
  'Drawing from 18+ years of educational experience, Natalie Cabinda offers practical strategies to help broken families rebuild after divorce. This book is an essential resource for single parents seeking hope, healing, and a roadmap for a better future.',
  'Natalie Cabinda',
  19.99,
  'https://www.amazon.com',
  '/images/book1.jpg',
  true,
  29.99,
  true,
  1
),
(
  'Post-Divorce Playbook',
  'Strategies for Thriving as a Single Parent',
  'A companion guide filled with actionable advice on stress management, raising high achievers, embracing optimism, and building the support network every single parent needs. Natalie Cabinda shares her personal journey and professional expertise in this empowering read.',
  'Natalie Cabinda',
  17.99,
  'https://www.amazon.com',
  '/images/book2.jpg',
  true,
  27.99,
  true,
  2
);

-- Blog posts
INSERT INTO blog_posts (title, slug, content, excerpt, author, category, published, created_at) VALUES
(
  'God is the Heroic in Us',
  'god-is-the-heroic-in-us',
  '<p>God is that HOPE we all nurse in our hearts for a better future. In the midst of life''s most turbulent storms, it is faith that anchors us and reminds us that we are not alone in our journey.</p><p>For single parents navigating the aftermath of divorce, hope is not just a feeling — it is a lifeline. It is the belief that tomorrow can be better than today, that our children will thrive, and that we have the strength to rebuild our lives from whatever rubble remains.</p><p>When we tap into the divine spark within us, we discover resources we never knew we had. Patience we thought was exhausted. Love that multiplies rather than diminishes. The courage to face another day, to show up for our children, and to model resilience in the face of adversity.</p><p>Embrace the heroic in you. It was placed there for a reason — to carry you through the moments when you feel like giving up, and to propel you toward the life you were always meant to live.</p>',
  'God is that HOPE we all nurse in our hearts for a better future. In the midst of life''s most turbulent storms, it is faith that anchors us.',
  'Natalie Cabinda',
  'Inspiration',
  true,
  '2024-01-15 10:00:00'
),
(
  'Be the Change You''d Like to See',
  'be-the-change-you-d-like-to-see',
  '<p>During a particularly harsh winter, I found myself snowed in with 33 inches of snow outside my door. The storm had shut down the city, cancelled school, and given me an unexpected gift: time to reflect.</p><p>In those quiet hours, watching the snow transform the familiar landscape into something entirely new, I thought about how change often works the same way. It covers the old, the worn, the familiar — and reveals something fresh underneath. Something clean.</p><p>Be the change you''d like to see is not just a motivational poster sentiment. It is a call to action. If you want your children to be resilient, show them resilience. If you want peace in your home, bring peace to your interactions. If you want hope for the future, be the embodiment of hope today.</p><p>The most powerful lessons we teach our children are not the ones we deliver with words, but with our actions. Every day we wake up and choose to move forward, we are writing the most important book our children will ever read — the story of our lives.</p>',
  'During a particularly harsh winter, I found myself snowed in with 33 inches of snow. The storm gave me an unexpected gift: time to reflect on what it means to be the change.',
  'Natalie Cabinda',
  'Personal Development',
  true,
  '2024-02-10 09:00:00'
),
(
  'Post Divorce Issue #6: Stress Management',
  'post-divorce-stress-management',
  '<p>Stress is a nonspecific response of your body to demands made upon it. For single parents post-divorce, these demands can feel overwhelming — managing the household alone, maintaining your career, being emotionally present for your children, and somehow carving out time for your own healing.</p><p>Understanding that stress is a physiological response is the first step toward managing it effectively. Your body is not broken; it is responding to an abnormal situation in a completely normal way.</p><h3>Practical Stress Management Strategies</h3><ul><li><strong>Prioritize sleep:</strong> Everything is harder when you are exhausted. Protect your sleep as a non-negotiable.</li><li><strong>Move your body:</strong> Even a 20-minute walk can significantly reduce cortisol levels and shift your perspective.</li><li><strong>Build your support network:</strong> Isolation amplifies stress. Reach out to family, friends, faith communities.</li><li><strong>Practice mindfulness:</strong> Five minutes of conscious breathing can interrupt the stress cycle and reset your nervous system.</li><li><strong>Set boundaries:</strong> Learn to say no to things that drain you and yes to things that restore you.</li></ul><p>Remember: you cannot pour from an empty cup. Taking care of yourself is not selfish — it is essential for taking care of your children.</p>',
  'Stress is a nonspecific response of your body to demands made upon it. For single parents post-divorce, these demands can feel overwhelming. Here are strategies that work.',
  'Natalie Cabinda',
  'Post-Divorce Series',
  true,
  '2024-02-28 11:00:00'
),
(
  'Post Divorce Issue #1: Embrace Optimism',
  'post-divorce-embrace-optimism',
  '<p>The mindset you carry into your post-divorce life will determine more about your outcome than almost any other single factor. For single parents, this is not just philosophy — it is survival strategy.</p><p>Optimism is not naivety. It is not pretending that the hard things are not hard, or that the pain is not real. Optimism is the deliberate choice to believe that things can and will improve — for you and for your children.</p><p>Research consistently shows that optimistic parents raise more resilient children. When our kids see us face adversity with a forward-looking attitude, we teach them that circumstances do not define us — our responses do.</p><h3>Building an Optimistic Mindset</h3><p>Start small. Each morning, identify one thing you are grateful for and one thing you are looking forward to. Over time, this practice rewires the brain toward positive expectation rather than anxious dread.</p><p>Surround yourself with people who believe in better outcomes. Energy is contagious — and you need the kind that lifts you up rather than pulls you down.</p><p>Most importantly, give yourself permission to hope. You have been through something difficult, but you are still here. That is evidence of your strength — and reason enough for optimism.</p>',
  'The mindset you carry into your post-divorce life will determine more about your outcome than almost any other single factor. Optimism is not naivety — it is a survival strategy.',
  'Natalie Cabinda',
  'Post-Divorce Series',
  true,
  '2024-03-05 10:00:00'
),
(
  'Post Divorce Issue #4: Children — Troubleshooting',
  'post-divorce-children-troubleshooting',
  '<p>Divorce affects children differently depending on their age, temperament, and the nature of the co-parenting relationship. As a single parent, you will inevitably face behavioral and emotional challenges that seem directly tied to the family transition. This post addresses the most common issues and offers practical guidance.</p><h3>Common Challenges and Solutions</h3><p><strong>Acting Out:</strong> Children often externalize internal pain through behavior. Before disciplining, ask what the behavior is communicating. Connect before you correct.</p><p><strong>Regression:</strong> Younger children especially may revert to earlier behaviors — bedwetting, thumb-sucking, clinginess. This is temporary and requires patience, not punishment.</p><p><strong>Playing Both Parents:</strong> Establish consistent rules across households where possible. Present a united front with your co-parent on major issues, even if your personal relationship is strained.</p><p><strong>School Performance Decline:</strong> Communicate with teachers. Alert them to the family situation so they can provide additional support. Establish a homework routine that gives structure during a time of upheaval.</p><p>Through all of it, keep communication open. Ask your children how they are feeling and validate every emotion — even the ones that are hard to hear. They need to know that their feelings are safe with you.</p>',
  'Divorce affects children differently based on their age and temperament. As a single parent, you will face behavioral and emotional challenges. Here is how to navigate them.',
  'Natalie Cabinda',
  'Post-Divorce Series',
  true,
  '2024-03-20 09:30:00'
),
(
  'Decluttering — Inside and Out',
  'decluttering-inside-and-out',
  '<p>There is something profoundly therapeutic about clearing physical space. When our environments are cluttered, our minds tend to mirror that chaos. For single parents in the midst of rebuilding, decluttering can be one of the most powerful — and most accessible — acts of self-care.</p><p>Start with one drawer. One corner. One shelf. The goal is not perfection; it is momentum. As you release the physical objects that no longer serve you, notice what feelings arise. Often, we hold onto things because letting go feels like another loss. But releasing the old makes room for the new.</p><h3>The Mental Declutter</h3><p>Physical decluttering is the gateway to mental clarity. Apply the same principles inward:</p><ul><li>Release grudges that drain your energy</li><li>Let go of the version of your life you planned and embrace the one you are building</li><li>Clear your mental calendar of obligations that do not align with your current priorities</li><li>Unfollow social media accounts that trigger comparison and inadequacy</li></ul><p>Decluttering is an ongoing practice, not a one-time event. Return to it regularly and notice how your capacity for peace expands as your space — physical and mental — opens up.</p>',
  'There is something profoundly therapeutic about clearing physical space. For single parents in the midst of rebuilding, decluttering can be one of the most powerful acts of self-care.',
  'Natalie Cabinda',
  'Lifestyle',
  true,
  '2024-04-01 10:00:00'
),
(
  'Post Divorce Issue #11: Raising High Achievers',
  'post-divorce-raising-high-achievers',
  '<p>One of the most common fears among single parents is that the divorce will derail their children''s potential. The research tells a more nuanced and ultimately hopeful story: children raised in supportive single-parent homes can and do thrive academically, professionally, and personally.</p><p>Parental expectations, communicated with warmth rather than pressure, are among the strongest predictors of academic success. Your belief in your child''s capability — expressed consistently and specifically — is more powerful than any tutoring program.</p><h3>Strategies for Raising High Achievers</h3><p><strong>Celebrate effort, not just outcome:</strong> When children learn that hard work is valued regardless of the result, they develop the growth mindset that underlies genuine achievement.</p><p><strong>Create a learning-friendly home:</strong> Books, conversations about ideas, questions that are welcomed rather than dismissed — these daily practices matter more than any single educational intervention.</p><p><strong>Model lifelong learning:</strong> When your children see you reading, growing, seeking new skills, they internalize that learning does not end at graduation.</p><p><strong>Know your child''s teachers:</strong> Parent involvement in education is consistently correlated with student success. Show up, communicate, and be an advocate.</p><p>Your children did not lose their potential when your marriage ended. In some ways, they gained a model of resilience, adaptability, and strength that will serve them for a lifetime.</p>',
  'One of the most common fears among single parents is that divorce will derail their children''s potential. Here is why that fear is often unfounded — and what you can do.',
  'Natalie Cabinda',
  'Post-Divorce Series',
  true,
  '2024-04-15 09:00:00'
),
(
  'Post Divorce Issue #5: Having Faith in Your Abilities',
  'post-divorce-faith-in-your-abilities',
  '<p>Self-doubt is one of the most insidious side effects of divorce. The dissolution of a marriage can shake your confidence in ways that go far beyond the relationship itself — causing you to question your judgment, your worth, your capacity to build something lasting.</p><p>But here is what I know to be true: the very fact that you are still standing, still caring for your children, still putting one foot in front of the other — that is evidence of ability you may have forgotten you possess.</p><h3>Rebuilding Self-Efficacy</h3><p>Self-efficacy — the belief in your capacity to accomplish what you set out to do — is not fixed. It grows when you set small goals and achieve them, when you do hard things and discover you can, when you stop waiting to feel ready and start acting in spite of uncertainty.</p><p>Continuous learning is one of the most powerful tools for rebuilding confidence. Take a class. Learn a new skill. Read widely. Every time you stretch your capabilities, you expand your sense of what is possible for you.</p><p>Surround yourself with people who see your potential — and have the courage to distance yourself from those who remind you only of your failures. Your community shapes your self-concept more than you may realize.</p><p>Trust yourself. You have navigated things that would have broken many. That is not evidence of weakness — it is proof of extraordinary strength.</p>',
  'Self-doubt is one of the most insidious side effects of divorce. But the fact that you are still standing, still caring for your children, is evidence of ability you may have forgotten.',
  'Natalie Cabinda',
  'Post-Divorce Series',
  true,
  '2024-05-01 10:00:00'
),
(
  'Persistence — Desire Behind the Wheel',
  'persistence-desire-behind-the-wheel',
  '<p>Desire is the driver behind the steering wheel of persistence. Without a clear and compelling vision of where you are going, the inevitable roadblocks of the journey will stop you. But when your desire is strong enough — when what you are moving toward matters deeply enough — persistence becomes not a virtue you have to manufacture, but a natural consequence of your commitment.</p><p>For single parents, this is particularly relevant. The road ahead is genuinely hard. There will be days when exhaustion wins, when the weight of doing everything alone feels unbearable, when the gap between where you are and where you want to be seems impossibly wide.</p><p>On those days, return to your why. Not the abstract, someday-I-want-to why — but the specific, immediate, living why. The face of a child who needs you. The version of yourself you are becoming. The life you are building, brick by brick, day by day.</p><p>Persistence does not require feeling strong. It only requires taking the next step. And the next. And the next. Eventually, you look back and realize that what felt like survival was actually progress — and what felt like barely holding on was, in fact, rebuilding.</p>',
  'Desire is the driver behind the steering wheel of persistence. Without a clear vision of where you are going, the inevitable roadblocks will stop you. Here is how to keep going.',
  'Natalie Cabinda',
  'Inspiration',
  true,
  '2024-05-20 11:00:00'
),
(
  'Step on the Ladder',
  'step-on-the-ladder',
  '<p>Every significant achievement in life began with a single, often unremarkable step. The ladder to your better future is real — but it must be climbed one rung at a time. There are no elevators to excellence, no shortcuts to the life you envision for yourself and your children.</p><p>The beauty of the ladder is that every step, no matter how small, moves you upward. The step you take today — applying for the job, enrolling in the class, having the difficult conversation, choosing the healthier meal — matters. It is not wasted. It is foundational.</p><p>Many single parents make the mistake of measuring progress only by arrival at the destination. But the journey is where transformation happens. It is in the daily decisions to keep climbing that character is formed, resilience is built, and the new life takes shape.</p><p>Step on the ladder today. Not tomorrow. Not when the conditions are perfect or the fear has disappeared or the path is completely clear. Today, in whatever small way is available to you, choose to move upward.</p><p>Your children are watching. They are learning what it looks like to pursue a better life in the face of difficulty. Give them that example. It may be the most valuable inheritance you ever leave them.</p>',
  'Every significant achievement in life began with a single, often unremarkable step. The ladder to your better future is real — but it must be climbed one rung at a time.',
  'Natalie Cabinda',
  'Motivation',
  true,
  '2024-06-01 09:00:00'
);

-- Hero slides
INSERT INTO hero_slides (image_url, title, subtitle, quote, quote_author, display_order, active) VALUES
('/images/hero1.jpg', 'Regroup. Refocus. Rebuild.', 'Strategies for single parents navigating life after divorce', NULL, NULL, 1, true),
('/images/hero2.jpg', 'You Are Stronger Than You Know', 'Drawing on 18+ years of educational experience', '"This book gave me hope when I thought there was none left."', 'A grateful reader', 2, true),
('/images/hero3.jpg', 'Rebuilding Takes Courage', 'Join a community of resilient single parents', '"Natalie''s approach changed how I parent and how I see myself."', 'Amazon reviewer', 3, true);

-- Speaking events
INSERT INTO speaking_events (title, description, location, active) VALUES
('Parent Empowerment Workshop', 'A half-day interactive workshop for single parents covering co-parenting strategies, stress management, and building support networks. Attendees leave with practical tools they can implement immediately.', 'Various Locations', true),
('School & Community Keynotes', 'Natalie brings her message of resilience, hope, and practical rebuilding strategies to schools, community organizations, faith communities, and corporate wellness programs.', 'Nationwide', true),
('Post-Divorce Recovery Seminar', 'A comprehensive seminar series designed to guide single parents through the emotional, practical, and financial aspects of rebuilding after divorce. Includes Q&A and peer support opportunities.', 'Virtual & In-Person', true);

-- Nonprofit programs
INSERT INTO nonprofit_programs (name, description, display_order, active) VALUES
('Support for Single Parents', 'Providing resources, mentorship, and community connections to single parents navigating life after divorce. Our program offers workshops, one-on-one coaching, and a peer support network.', 1, true),
('Children''s Resilience Initiative', 'Age-appropriate programs designed to help children of divorce build emotional resilience, maintain academic performance, and develop healthy coping strategies.', 2, true),
('Community Rebuild Network', 'Building bridges between single-parent families and community resources, from legal aid to counseling to financial literacy education. No family should have to rebuild alone.', 3, true);
