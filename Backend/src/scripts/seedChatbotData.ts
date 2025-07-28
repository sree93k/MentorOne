import mongoose from "mongoose";
import { FAQ } from "../models/FAQModel";
import { FAQCategory } from "../models/FAQCategoryModel";

const SEED_CATEGORIES = [
  {
    name: "Getting Started",
    description: "Basic information for new users",
    priority: 10,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    name: "Pricing",
    description: "Information about our pricing plans",
    priority: 9,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    name: "Sessions",
    description: "How mentoring sessions work",
    priority: 8,
    targetUsers: ["mentee", "mentor"],
  },
  {
    name: "Platform Features",
    description: "Platform capabilities and tools",
    priority: 7,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    name: "Mentor-Specific",
    description: "Information for mentors",
    priority: 6,
    targetUsers: ["mentor"],
  },
  {
    name: "Mentee-Specific",
    description: "Information for mentees",
    priority: 6,
    targetUsers: ["mentee"],
  },
  {
    name: "Support",
    description: "Help and support information",
    priority: 5,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
];

const SEED_FAQS = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I find the right mentor?",
    answer:
      "Browse our mentor profiles, filter by expertise, and book a consultation. We match you based on your goals and learning style. You can search by skills, experience level, or industry background.",
    keywords: [
      "find",
      "mentor",
      "search",
      "match",
      "browse",
      "right",
      "suitable",
    ],
    priority: 10,
    targetUsers: ["anonymous", "mentee"],
  },
  {
    category: "Getting Started",
    question: "How do I sign up as a mentee?",
    answer:
      "Click 'Sign Up' and select 'Mentee'. Fill in your profile with your learning goals, background, and what you're looking to achieve. It takes just 3 minutes to get started!",
    keywords: ["signup", "sign up", "register", "mentee", "join", "account"],
    priority: 9,
    targetUsers: ["anonymous"],
  },
  {
    category: "Getting Started",
    question: "How do I become a mentor?",
    answer:
      "Apply to become a mentor by clicking 'Become a Mentor'. We'll review your experience and expertise. Once approved, you can set your availability and start helping mentees.",
    keywords: ["become", "mentor", "apply", "join", "teach", "guide"],
    priority: 9,
    targetUsers: ["anonymous"],
  },

  // Pricing
  {
    category: "Pricing",
    question: "What are your pricing plans?",
    answer:
      "We offer flexible pricing: $50/session for 1-on-1 mentoring, $30/session for group sessions, and monthly packages starting at $150. All plans include session recordings and follow-up resources.",
    keywords: ["price", "cost", "plan", "payment", "fee", "money", "pricing"],
    priority: 10,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    category: "Pricing",
    question: "Do you offer free trials?",
    answer:
      "Yes! New mentees get a 15-minute discovery call with any mentor for free. This helps you find the right fit before committing to paid sessions.",
    keywords: ["free", "trial", "demo", "test", "discovery", "sample"],
    priority: 8,
    targetUsers: ["anonymous", "mentee"],
  },
  {
    category: "Pricing",
    question: "How do mentors get paid?",
    answer:
      "Mentors receive 70% of session fees, paid weekly via bank transfer or PayPal. We handle all payment processing, so you can focus on mentoring.",
    keywords: [
      "mentor",
      "payment",
      "earnings",
      "payout",
      "commission",
      "money",
    ],
    priority: 7,
    targetUsers: ["mentor"],
  },

  // Sessions
  {
    category: "Sessions",
    question: "How long are mentoring sessions?",
    answer:
      "Standard sessions are 60 minutes, but we offer 30-minute quick consultations and 90-minute deep-dive sessions. You can choose what works best for your needs.",
    keywords: ["session", "duration", "length", "time", "minutes", "long"],
    priority: 9,
    targetUsers: ["mentee", "mentor"],
  },
  {
    category: "Sessions",
    question: "Can I reschedule sessions?",
    answer:
      "Yes! You can reschedule up to 24 hours before your session through your dashboard or by contacting your mentor directly. Same-day changes may incur a fee.",
    keywords: ["reschedule", "change", "cancel", "move", "postpone", "modify"],
    priority: 8,
    targetUsers: ["mentee", "mentor"],
  },
  {
    category: "Sessions",
    question: "Are sessions recorded?",
    answer:
      "Yes, all sessions are automatically recorded (with consent) and available in your dashboard within 24 hours. You can review key insights and action items anytime.",
    keywords: ["record", "recording", "replay", "video", "review", "save"],
    priority: 7,
    targetUsers: ["mentee", "mentor"],
  },

  // Platform Features
  {
    category: "Platform Features",
    question: "What tools do you provide?",
    answer:
      "Our platform includes video calling, screen sharing, digital whiteboard, session recordings, progress tracking, goal setting, and resource sharing. Everything you need for effective mentoring!",
    keywords: [
      "tools",
      "features",
      "video",
      "screen",
      "whiteboard",
      "platform",
    ],
    priority: 8,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    category: "Platform Features",
    question: "Can I track my progress?",
    answer:
      "Absolutely! Your dashboard shows learning goals, completed sessions, skill improvements, and mentor feedback. You can also set custom milestones and track achievements.",
    keywords: [
      "progress",
      "track",
      "goals",
      "dashboard",
      "improvement",
      "achievements",
    ],
    priority: 7,
    targetUsers: ["mentee"],
  },

  // Mentor-Specific
  {
    category: "Mentor-Specific",
    question: "How do I manage my availability?",
    answer:
      "Use your mentor dashboard to set your weekly schedule, block out busy times, and set different rates for different time slots. The system handles all booking automatically.",
    keywords: [
      "availability",
      "schedule",
      "calendar",
      "time",
      "booking",
      "manage",
    ],
    priority: 8,
    targetUsers: ["mentor"],
  },
  {
    category: "Mentor-Specific",
    question: "What if I'm not satisfied with a mentee?",
    answer:
      "We provide guidelines for effective mentoring relationships. If issues persist, you can end the mentoring relationship professionally, and we'll help both parties find better matches.",
    keywords: ["mentee", "problem", "issue", "end", "relationship", "mismatch"],
    priority: 5,
    targetUsers: ["mentor"],
  },

  // Mentee-Specific
  {
    category: "Mentee-Specific",
    question: "What if I'm not satisfied with my mentor?",
    answer:
      "We offer a satisfaction guarantee. You can request a new mentor match within your first 3 sessions at no extra cost. We want you to find the perfect mentoring relationship!",
    keywords: [
      "mentor",
      "unsatisfied",
      "change",
      "switch",
      "guarantee",
      "refund",
    ],
    priority: 8,
    targetUsers: ["mentee"],
  },
  {
    category: "Mentee-Specific",
    question: "How often should I meet with my mentor?",
    answer:
      "Most successful mentees meet weekly or bi-weekly. However, frequency depends on your goals, budget, and availability. Your mentor can help you determine the best schedule.",
    keywords: [
      "frequency",
      "often",
      "schedule",
      "weekly",
      "regular",
      "meetings",
    ],
    priority: 6,
    targetUsers: ["mentee"],
  },

  // Support
  {
    category: "Support",
    question: "How can I contact support?",
    answer:
      "You can reach our support team via email at support@mentorplatform.com, through the chat widget, or by submitting a ticket in your dashboard. We respond within 24 hours.",
    keywords: ["support", "help", "contact", "email", "ticket", "assistance"],
    priority: 7,
    targetUsers: ["anonymous", "mentee", "mentor"],
  },
  {
    category: "Support",
    question: "Do you offer technical support?",
    answer:
      "Yes! We provide technical support for platform issues, connection problems, and feature questions. Our team can also help with video call setup and troubleshooting.",
    keywords: [
      "technical",
      "support",
      "bug",
      "issue",
      "problem",
      "help",
      "video",
    ],
    priority: 6,
    targetUsers: ["mentee", "mentor"],
  },
];

export async function seedChatbotData() {
  try {
    console.log("🌱 Starting chatbot data seeding...");

    // Clear existing data
    await FAQ.deleteMany({});
    await FAQCategory.deleteMany({});
    console.log("🧹 Cleared existing FAQ data");

    // Create categories
    const categoryMap = new Map();
    for (const categoryData of SEED_CATEGORIES) {
      const category = new FAQCategory(categoryData);
      await category.save();
      categoryMap.set(categoryData.name, category._id);
      console.log(`📁 Created category: ${categoryData.name}`);
    }

    // Create FAQs
    let faqCount = 0;
    for (const faqData of SEED_FAQS) {
      const categoryId = categoryMap.get(faqData.category);
      if (!categoryId) {
        console.error(`❌ Category not found: ${faqData.category}`);
        continue;
      }

      const faq = new FAQ({
        ...faqData,
        categoryId,
        analytics: {
          views: Math.floor(Math.random() * 50), // Random initial views
          helpful: Math.floor(Math.random() * 20),
          notHelpful: Math.floor(Math.random() * 5),
        },
      });

      await faq.save();
      faqCount++;
      console.log(`❓ Created FAQ: ${faqData.question.substring(0, 50)}...`);
    }

    console.log(
      `✅ Successfully seeded ${SEED_CATEGORIES.length} categories and ${faqCount} FAQs`
    );

    // Create text indexes for search
    await FAQ.collection.createIndex({
      question: "text",
      keywords: "text",
      answer: "text",
    });
    console.log("🔍 Created search indexes");

    return {
      categories: SEED_CATEGORIES.length,
      faqs: faqCount,
    };
  } catch (error) {
    console.error("❌ Error seeding chatbot data:", error);
    throw error;
  }
}
