import { useState, useEffect } from 'react';
import { useProfile } from '../context/profile-context';
import { useTrips } from './use-trips';

type Message = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
};

export function useAssistant() {
  const { profile } = useProfile();
  const { trips, recommendations } = useTrips();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initial greeting when profile changes
  useEffect(() => {
    if (profile && messages.length === 0) {
      const greeting = {
        id: 'initial-greeting',
        sender: 'assistant' as const,
        text: 'שלום! אני העוזר האישי שלך לטיולים. אני יכול לעזור לך לתכנן את המסלול, למצוא המלצות למקומות, לקבל טיפים על תקציב ועוד. במה אני יכול לעזור לך היום?',
        timestamp: new Date().toISOString(),
      };
      setMessages([greeting]);
    }
  }, [profile]);

  // Utility to get readable preference text
  const getPreferenceText = (profileData: any, key: string) => {
    const value = profileData[key];
    if (!value || value.length === 0) return 'לא צוין';
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  // Mock function to get local dish based on city
  const getLocalDishForCity = (city: string) => {
    const dishes: Record<string, string> = {
      'בנגקוק': 'פאד תאי',
      'האנוי': 'פו',
      'ניו דלהי': 'ביריאני',
      'לימה': 'סביצה',
    };
    return dishes[city] || 'מאכל מקומי';
  };

  // Generate a response based on user query
  const generateResponse = (query: string) => {
    if (!profile) {
      return 'אני לא רואה את הפרופיל שלך. אנא התחבר כדי שאוכל לעזור לך בצורה הטובה ביותר.';
    }

    // Handle travel destination questions
    if (query.toLowerCase().includes('איפה') || query.toLowerCase().includes('לאן') || query.toLowerCase().includes('יעד')) {
      if (query.toLowerCase().includes('אפריל') && query.toLowerCase().includes('וייטנאם')) {
        return 'באפריל, מזג האוויר בוייטנאם נהדר בצפון ובמרכז. אני ממליץ על האנוי, מפרץ הא לונג והוי אן. האם תרצה שאפרט יותר על אחד מהמקומות האלה?';
      }
      return `בהתחשב ב${getPreferenceText(profile, 'activities')}, אני ממליץ לך לנסות את תאילנד, במיוחד את צ'אנג מאי וקו פי פי. האם תרצה שאבנה לך מסלול מפורט?`;
    }

    // Handle safety and health tips
    if (query.toLowerCase().includes('בטיחות') || query.toLowerCase().includes('בריאות') || 
        query.toLowerCase().includes('חיסונים') || query.toLowerCase().includes('גט לג')) {
      if (query.toLowerCase().includes('גט לג')) {
        return 'להתמודדות עם גט לג, אני ממליץ: 1) התאם את השעון שלך לזמן המקומי כמה ימים לפני הטיסה, 2) שתה הרבה מים ותמנע מאלכוהול בטיסה, 3) נסה להישאר ער עד שעת השינה המקומית ביום ההגעה, 4) בלה זמן באור השמש ביום הראשון, ו-5) שקול לקחת מלטונין אם יש לך קשיי שינה.';
      }
      if (query.toLowerCase().includes('חיסונים')) {
        return 'לפני טיול לדרום אמריקה או אסיה, מומלץ לבדוק חיסונים נגד צהבת A ו-B, טיפוס הבטן, וקדחת צהובה (במיוחד לאמזונס). אני ממליץ להתייעץ עם רופא או מרפאת מטיילים לפחות 6 שבועות לפני הנסיעה. לאיזה יעד אתה מתכנן לנסוע?';
      }
      return 'בטיחות בטיול היא חשובה מאוד. אני ממליץ: 1) תמיד שמור על הדרכון והכסף במקום בטוח, 2) הימנע מהליכה לבד באזורים לא מוכרים בלילה, 3) הורד מפות לא מקוונות של האזור, 4) שמור על קשר עם משפחה או חברים ודווח על מיקומך, ו-5) בדוק את הנחיות משרד החוץ לפני נסיעה למקום חדש. האם יש לך יעד ספציפי שאתה מודאג לגביו?';
    }

    // Handle food suggestions
    if (query.toLowerCase().includes('אוכל') || query.toLowerCase().includes('מסעדה') || query.toLowerCase().includes('מאכלים')) {
      if (query.toLowerCase().includes('בנגקוק')) {
        return `בהתחשב ב${getPreferenceText(profile, 'food')}, אני ממליץ לנסות פאד תאי בבנגקוק. יש שם גם שווקי לילה כמו שוק רוט פאי עם אוכל רחוב מעולה. האם תרצה שאמליץ על מסעדה ספציפית?`;
      }
      if (query.toLowerCase().includes('האנוי')) {
        return `בהתחשב ב${getPreferenceText(profile, 'food')}, אני ממליץ לנסות פו בהאנוי. יש שם גם מקומות נהדרים לבאן מי. האם תרצה שאמליץ על מקום ספציפי?`;
      }
      return `בהתחשב ב${getPreferenceText(profile, 'food')}, אני ממליץ לנסות מאכלים מקומיים בכל יעד. איפה אתה נמצא כרגע או לאן אתה מתכנן לנסוע?`;
    }

    // Handle trip planning
    if (query.toLowerCase().includes('תכנן') || query.toLowerCase().includes('מסלול') || query.toLowerCase().includes('תקציב')) {
      if (query.toLowerCase().includes('הודו') && query.toLowerCase().includes('שבועיים') && query.toLowerCase().includes('6000')) {
        return `אני שמח לתכנן לך טיול של שבועיים בהודו בתקציב של 6000 ש"ח. הנה הצעה למסלול:
- ימים 1-4: ניו דלהי וג'איפור (ראג'סטאן) - תקציב יומי 400 ש"ח כולל לינה בהוסטל ואוכל רחוב.
- ימים 5-8: אגרה (טאג' מאהל) וורנאסי - תקציב יומי 450 ש"ח כולל נסיעות ברכבת.
- ימים 9-14: רישיקש ודהראמסאלה - תקציב יומי 350 ש"ח, מיקוד ביוגה וטבע.
בהתחשב ב${getPreferenceText(profile, 'activities')}, הוספתי זמן בדהראמסאלה למדיטציה וטיולים. האם תרצה שאפרט יותר על אחד היעדים או שאתאים את המסלול לתקציב אחר?`;
      } else if (query.toLowerCase().includes('הודו') && query.toLowerCase().includes('שבועיים')) {
        return `אני שמח לתכנן לך טיול של שבועיים בהודו. הנה הצעה למסלול:
- ימים 1-4: ניו דלהי וג'איפור (ראג'סטאן) - חקירת תרבות והיסטוריה.
- ימים 5-8: אגרה (טאג' מאהל) וורנאסי - חוויה רוחנית.
- ימים 9-14: רישיקש ודהראמסאלה - מיקוד ביוגה וטבע.
בהתחשב ב${getPreferenceText(profile, 'activities')}, הוספתי זמן בדהראמסאלה למדיטציה וטיולים. האם תרצה שאפרט יותר על אחד היעדים או שאתאים את המסלול לתקציב ספציפי?`;
      }
      return `אני יכול לעזור לך לתכנן מסלול מותאם אישית. אנא ספר לי לאן אתה רוצה לנסוע, לכמה זמן, ומה התקציב שלך.`;
    }

    return 'אני כאן כדי לעזור לך עם כל שאלה על טיולים. האם תוכל לפרט יותר על מה שאתה מחפש?';
  };

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call or processing delay
    setTimeout(() => {
      const responseText = generateResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant' as const,
        text: responseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}