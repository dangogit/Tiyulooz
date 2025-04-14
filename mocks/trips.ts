export const trips = [
  {
    id: "1",
    title: "הטיול הגדול לתאילנד",
    startDate: "2023-12-15",
    endDate: "2023-12-20",
    destinations: [
      {
        id: "bkk",
        name: "בנגקוק",
        country: "תאילנד",
        startDate: "2023-12-15",
        endDate: "2023-12-20",
        accommodation: {
          name: "Lub d Bangkok Silom",
          type: "hostel",
          price: 15,
          address: "Silom, Bangkok",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "ארמון המלך",
            date: "2023-12-16",
            price: 15,
            booked: true,
          },
          {
            name: "שוק צף",
            date: "2023-12-17",
            price: 25,
            booked: false,
          },
          {
            name: "מקדש ואט פו",
            date: "2023-12-18",
            price: 5,
            booked: true,
          },
        ],
      },
      {
        id: "cnx",
        name: "צ'יאנג מאי",
        country: "תאילנד",
        startDate: "2023-12-20",
        endDate: "2023-12-27",
        accommodation: {
          name: "Hostel Lullaby",
          type: "hostel",
          price: 12,
          address: "Old City, Chiang Mai",
          image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "טרק בג'ונגל",
            date: "2023-12-22",
            price: 35,
            booked: true,
          },
          {
            name: "מקדש דוי סוטפ",
            date: "2023-12-23",
            price: 5,
            booked: false,
          },
          {
            name: "שיעור בישול תאילנדי",
            date: "2023-12-24",
            price: 30,
            booked: true,
          },
        ],
      },
      {
        id: "phi",
        name: "קו פי פי",
        country: "תאילנד",
        startDate: "2023-12-27",
        endDate: "2024-01-05",
        accommodation: {
          name: "Phi Phi Viewpoint Resort",
          type: "hotel",
          price: 45,
          address: "Phi Phi Island",
          image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "שנורקלינג במפרץ מאיה",
            date: "2023-12-29",
            price: 20,
            booked: true,
          },
          {
            name: "טיול סירות לאיים",
            date: "2023-12-30",
            price: 25,
            booked: false,
          },
          {
            name: "מסיבת חוף",
            date: "2023-12-31",
            price: 15,
            booked: true,
          },
        ],
      },
      {
        id: "phn",
        name: "קו פנגן",
        country: "תאילנד",
        startDate: "2024-01-05",
        endDate: "2024-01-15",
        accommodation: {
          name: "Cocohut Beach Resort",
          type: "hotel",
          price: 50,
          address: "Leela Beach, Koh Phangan",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "מסיבת ירח מלא",
            date: "2024-01-07",
            price: 30,
            booked: true,
          },
          {
            name: "יוגה בחוף",
            date: "2024-01-09",
            price: 10,
            booked: false,
          },
          {
            name: "טיול ג'יפים באי",
            date: "2024-01-11",
            price: 25,
            booked: false,
          },
        ],
      },
    ],
    budget: {
      total: 2000,
      spent: 1250,
      remaining: 750,
      categories: {
        accommodation: 650,
        food: 300,
        activities: 200,
        transportation: 100,
      },
    },
    itinerary: {
      "2023-12-15": [
        {
          id: "bkk-accommodation",
          date: "2023-12-15",
          type: "accommodation",
          name: "Lub d Bangkok Silom",
          price: 15
        }
      ],
      "2023-12-16": [
        {
          id: "bkk-activity-1",
          date: "2023-12-16",
          type: "activity",
          name: "ארמון המלך",
          price: 15
        }
      ],
      "2023-12-17": [
        {
          id: "bkk-activity-2",
          date: "2023-12-17",
          type: "activity",
          name: "שוק צף",
          price: 25
        }
      ],
      "2023-12-18": [
        {
          id: "bkk-activity-3",
          date: "2023-12-18",
          type: "activity",
          name: "מקדש ואט פו",
          price: 5
        }
      ]
    },
    notes: "להביא קרם הגנה ודוחה יתושים. לא לשכוח לקנות מתנות למשפחה בבנגקוק.",
  },
  {
    id: "2",
    title: "דרום אמריקה - פרו וקולומביה",
    startDate: "2024-03-10",
    endDate: "2024-04-20",
    destinations: [
      {
        id: "lim",
        name: "לימה",
        country: "פרו",
        startDate: "2024-03-10",
        endDate: "2024-03-15",
        accommodation: {
          name: "Pariwana Hostel",
          type: "hostel",
          price: 18,
          address: "Miraflores, Lima",
          image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "סיור קולינרי",
            date: "2024-03-11",
            price: 40,
            booked: false,
          },
          {
            name: "מוזיאון לארקו",
            date: "2024-03-12",
            price: 10,
            booked: false,
          },
        ],
      },
      {
        id: "cuz",
        name: "קוסקו",
        country: "פרו",
        startDate: "2024-03-15",
        endDate: "2024-03-25",
        accommodation: {
          name: "Wild Rover Hostel",
          type: "hostel",
          price: 15,
          address: "Centro Historico, Cusco",
          image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "מאצ'ו פיצ'ו",
            date: "2024-03-18",
            price: 150,
            booked: true,
          },
          {
            name: "עמק הקדוש",
            date: "2024-03-20",
            price: 45,
            booked: false,
          },
          {
            name: "הר הקשת",
            date: "2024-03-22",
            price: 80,
            booked: false,
          },
        ],
      },
      {
        id: "bog",
        name: "בוגוטה",
        country: "קולומביה",
        startDate: "2024-03-25",
        endDate: "2024-04-01",
        accommodation: {
          name: "Selina Bogota",
          type: "hostel",
          price: 20,
          address: "Chapinero, Bogota",
          image: "https://images.unsplash.com/photo-1630710478035-9b5b36fe098b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "סיור גרפיטי",
            date: "2024-03-26",
            price: 15,
            booked: false,
          },
          {
            name: "מוזיאון הזהב",
            date: "2024-03-27",
            price: 5,
            booked: false,
          },
        ],
      },
      {
        id: "med",
        name: "מדיין",
        country: "קולומביה",
        startDate: "2024-04-01",
        endDate: "2024-04-10",
        accommodation: {
          name: "Los Patios Hostel",
          type: "hostel",
          price: 18,
          address: "El Poblado, Medellin",
          image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "סיור פבלו אסקובר",
            date: "2024-04-03",
            price: 25,
            booked: false,
          },
          {
            name: "פארק ארווי",
            date: "2024-04-05",
            price: 20,
            booked: false,
          },
        ],
      },
      {
        id: "ctg",
        name: "קרטחנה",
        country: "קולומביה",
        startDate: "2024-04-10",
        endDate: "2024-04-20",
        accommodation: {
          name: "Bourbon St. Hostal",
          type: "hostel",
          price: 22,
          address: "Getsemani, Cartagena",
          image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        activities: [
          {
            name: "סיור בעיר העתיקה",
            date: "2024-04-11",
            price: 15,
            booked: false,
          },
          {
            name: "איי רוסאריו",
            date: "2024-04-13",
            price: 35,
            booked: false,
          },
          {
            name: "וולקן הבוץ",
            date: "2024-04-15",
            price: 25,
            booked: false,
          },
        ],
      },
    ],
    budget: {
      total: 3000,
      spent: 800,
      remaining: 2200,
      categories: {
        accommodation: 400,
        food: 200,
        activities: 150,
        transportation: 50,
      },
    },
    itinerary: {
      "2024-03-10": [
        {
          id: "lim-accommodation",
          date: "2024-03-10",
          type: "accommodation",
          name: "Pariwana Hostel",
          price: 18
        }
      ],
      "2024-03-11": [
        {
          id: "lim-activity-1",
          date: "2024-03-11",
          type: "activity",
          name: "סיור קולינרי",
          price: 40
        }
      ],
      "2024-03-12": [
        {
          id: "lim-activity-2",
          date: "2024-03-12",
          type: "activity",
          name: "מוזיאון לארקו",
          price: 10
        }
      ]
    },
    notes: "לקחת תרופות נגד מלריה. להחליף כסף בשדה התעופה בלימה.",
  },
];

export const recommendations = [
  {
    id: "rec-dest-1",
    type: "destination",
    name: "פוקט",
    image: "https://images.unsplash.com/photo-1589394815804-964d7e794b36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 100,
    description: "חופים מדהימים ומסיבות תוססות",
    suitableFor: ["parties", "surfing"]
  },
  {
    id: "rec-dest-2",
    type: "destination",
    name: "צ'אנג ראי",
    image: "https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 80,
    description: "מקדשים יפהפיים וטבע שליו",
    suitableFor: ["yoga", "culture", "nature"]
  },
  {
    id: "rec-acc-1",
    type: "accommodation",
    name: "Blue Monkey Hostel",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 20,
    description: "הוסטל ידידותי עם אווירה חברתית",
    suitableFor: ["parties"]
  },
  {
    id: "rec-acc-2",
    type: "accommodation",
    name: "Mountain Retreat",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 35,
    description: "בקתות שלוות בהרים",
    suitableFor: ["yoga", "relaxing", "nature"]
  },
  {
    id: "rec-rest-1",
    type: "restaurant",
    name: "Taste of Thailand",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 15,
    description: "מסעדה מקומית אותנטית",
    suitableFor: ["food", "culture"]
  },
  {
    id: "rec-rest-2",
    type: "restaurant",
    name: "Beachfront Grill",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 25,
    description: "ארוחה עם נוף לים",
    suitableFor: ["food", "relaxing"]
  },
  {
    id: "rec-act-1",
    type: "activity",
    name: "שיעור גלישה",
    image: "https://images.unsplash.com/photo-1508685096485-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 30,
    description: "למד לגלוש עם מדריכים מקצועיים",
    suitableFor: ["surfing", "parties"]
  },
  {
    id: "rec-act-2",
    type: "activity",
    name: "מדיטציה ויוגה",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 10,
    description: "חוויית רוגע ושלווה",
    suitableFor: ["yoga", "relaxing", "spiritual"]
  },
  {
    id: "rec-act-3",
    type: "activity",
    name: "טרק בהרים",
    image: "https://images.unsplash.com/photo-1463694774067-71d801a4e938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 40,
    description: "מסלולי הליכה עם נופים עוצרי נשימה",
    suitableFor: ["hiking", "nature"]
  },
  {
    id: "rec-act-4",
    type: "activity",
    name: "סיור אוכל רחוב",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    price: 20,
    description: "טעם אותנטי של המטבח המקומי",
    suitableFor: ["food", "culture"]
  }
];