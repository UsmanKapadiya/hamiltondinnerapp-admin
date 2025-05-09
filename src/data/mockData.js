import { tokens } from "../theme";

export const type=[
  {id:1, type_name:"Breakfast"},
  {id:2, type_name:"Lunch"},
  {id:3, type_name:"Dinner"}] 

  export const rolesData = [
    { id: 1, role_name: "admin", role_display: "Administrator" },
    { id: 2, role_name: "editor", role_display: "Content Editor" },
    { id: 3, role_name: "viewer", role_display: "Content Viewer" },
    { id: 4, role_name: "moderator", role_display: "Forum Moderator" },
    { id: 5, role_name: "contributor", role_display: "Content Contributor" },
    { id: 6, role_name: "analyst", role_display: "Data Analyst" },
    { id: 7, role_name: "support", role_display: "Support Staff" },
    { id: 8, role_name: "developer", role_display: "Software Developer" },
    { id: 9, role_name: "designer", role_display: "UI/UX Designer" },
    { id: 10, role_name: "qa", role_display: "Quality Assurance" },
    { id: 11, role_name: "hr", role_display: "HR Manager" },
    { id: 12, role_name: "finance", role_display: "Finance Officer" },
    { id: 13, role_name: "marketing", role_display: "Marketing Specialist" },
    { id: 14, role_name: "sales", role_display: "Sales Representative" },
    { id: 15, role_name: "intern", role_display: "Intern" },
    { id: 16, role_name: "trainer", role_display: "Trainer" },
    { id: 17, role_name: "security", role_display: "Security Officer" },
    { id: 18, role_name: "project_manager", role_display: "Project Manager" },
    { id: 19, role_name: "product_manager", role_display: "Product Manager" },
    { id: 20, role_name: "cto", role_display: "Chief Technology Officer" },
    { id: 21, role_name: "ceo", role_display: "Chief Executive Officer" },
    { id: 22, role_name: "coo", role_display: "Chief Operating Officer" },
    { id: 23, role_name: "cfo", role_display: "Chief Financial Officer" },
    { id: 24, role_name: "lead_developer", role_display: "Lead Developer" },
    { id: 25, role_name: "business_analyst", role_display: "Business Analyst" }
  ];

  export const usersMockData = [
    {
      id: 1,
      name: "Alice Johnson",
      user_name: "alicej",
      email: "alice@example.com",
      password: "hashed_password_1",
      email_verified_at: "2025-05-01",
      created_at: "2025-04-01",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "admin",
      roles: ["admin", "editor"]
    },
    {
      id: 2,
      name: "Bob Smith",
      user_name: "bobsmith",
      email: "bob@example.com",
      password: "hashed_password_2",
      email_verified_at: "2025-05-01",
      created_at: "2025-04-01",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "editor",
      roles: ["editor"]
    },
    {
      id: 3,
      name: "Catherine Lee",
      user_name: "catherine",
      email: "catherine@example.com",
      password: "hashed_password_3",
      email_verified_at: null,
      created_at: "2025-04-01",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 4,
      name: "Daniel Kim",
      user_name: "danielk",
      email: "daniel@example.com",
      password: "hashed_password_4",
      email_verified_at: "2025-05-02",
      created_at: "2025-04-01",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "admin",
      roles: ["admin"]
    },
    {
      id: 5,
      name: "Emily Davis",
      user_name: "emilyd",
      email: "emily@example.com",
      password: "hashed_password_5",
      email_verified_at: "2025-05-02",
      created_at: "2025-04-02",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "editor",
      roles: ["editor", "contributor"]
    },
    {
      id: 6,
      name: "Frank Harris",
      user_name: "frankh",
      email: "frank@example.com",
      password: "hashed_password_6",
      email_verified_at: null,
      created_at: "2025-04-02",
      avatar: "https://i.pravatar.cc/150?img=6",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 7,
      name: "Grace Park",
      user_name: "gracep",
      email: "grace@example.com",
      password: "hashed_password_7",
      email_verified_at: "2025-05-03",
      created_at: "2025-04-03",
      avatar: "https://i.pravatar.cc/150?img=7",
      role: "admin",
      roles: ["admin", "manager"]
    },
    {
      id: 8,
      name: "Henry Brown",
      user_name: "henryb",
      email: "henry@example.com",
      password: "hashed_password_8",
      email_verified_at: null,
      created_at: "2025-04-03",
      avatar: "https://i.pravatar.cc/150?img=8",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 9,
      name: "Isabella Moore",
      user_name: "isabellam",
      email: "isabella@example.com",
      password: "hashed_password_9",
      email_verified_at: "2025-05-03",
      created_at: "2025-04-03",
      avatar: "https://i.pravatar.cc/150?img=9",
      role: "editor",
      roles: ["editor", "moderator"]
    },
    {
      id: 10,
      name: "Jack Wilson",
      user_name: "jackw",
      email: "jack@example.com",
      password: "hashed_password_10",
      email_verified_at: "2025-05-04",
      created_at: "2025-04-04",
      avatar: "https://i.pravatar.cc/150?img=10",
      role: "editor",
      roles: ["editor"]
    },
    {
      id: 11,
      name: "Karen White",
      user_name: "karenw",
      email: "karen@example.com",
      password: "hashed_password_11",
      email_verified_at: null,
      created_at: "2025-04-04",
      avatar: "https://i.pravatar.cc/150?img=11",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 12,
      name: "Leo Martinez",
      user_name: "leom",
      email: "leo@example.com",
      password: "hashed_password_12",
      email_verified_at: "2025-05-04",
      created_at: "2025-04-04",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "admin",
      roles: ["admin"]
    },
    {
      id: 13,
      name: "Mia Anderson",
      user_name: "miaa",
      email: "mia@example.com",
      password: "hashed_password_13",
      email_verified_at: "2025-05-05",
      created_at: "2025-04-05",
      avatar: "https://i.pravatar.cc/150?img=13",
      role: "editor",
      roles: ["editor", "writer"]
    },
    {
      id: 14,
      name: "Nathan Scott",
      user_name: "nathans",
      email: "nathan@example.com",
      password: "hashed_password_14",
      email_verified_at: null,
      created_at: "2025-04-05",
      avatar: "https://i.pravatar.cc/150?img=14",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 15,
      name: "Olivia Taylor",
      user_name: "oliviat",
      email: "olivia@example.com",
      password: "hashed_password_15",
      email_verified_at: "2025-05-05",
      created_at: "2025-04-05",
      avatar: "https://i.pravatar.cc/150?img=15",
      role: "editor",
      roles: ["editor"]
    },
    {
      id: 16,
      name: "Paul Allen",
      user_name: "paula",
      email: "paul@example.com",
      password: "hashed_password_16",
      email_verified_at: "2025-05-06",
      created_at: "2025-04-06",
      avatar: "https://i.pravatar.cc/150?img=16",
      role: "admin",
      roles: ["admin"]
    },
    {
      id: 17,
      name: "Queenie Zhao",
      user_name: "queenz",
      email: "queenie@example.com",
      password: "hashed_password_17",
      email_verified_at: null,
      created_at: "2025-04-06",
      avatar: "https://i.pravatar.cc/150?img=17",
      role: "viewer",
      roles: ["viewer"]
    },
    {
      id: 18,
      name: "Ryan Evans",
      user_name: "ryane",
      email: "ryan@example.com",
      password: "hashed_password_18",
      email_verified_at: "2025-05-06",
      created_at: "2025-04-06",
      avatar: "https://i.pravatar.cc/150?img=18",
      role: "editor",
      roles: ["editor"]
    },
    {
      id: 19,
      name: "Sophie Hall",
      user_name: "sophieh",
      email: "sophie@example.com",
      password: "hashed_password_19",
      email_verified_at: "2025-05-07",
      created_at: "2025-04-07",
      avatar: "https://i.pravatar.cc/150?img=19",
      role: "manager",
      roles: ["manager"]
    },
    {
      id: 20,
      name: "Tom Green",
      user_name: "tomg",
      email: "tom@example.com",
      password: "hashed_password_20",
      email_verified_at: null,
      created_at: "2025-04-07",
      avatar: "https://i.pravatar.cc/150?img=20",
      role: "viewer",
      roles: ["viewer"]
    }
  ];
  
  


  export const PermissionsList =  {
    "data": [
        {
            "label": "Browse Admin",
            "key": "browse_Admin"
        },
        {
            "label": "Browse Bread",
            "key": "browse_Bread"
        },
        {
            "label": "Browse Database",
            "key": "browse_Database"
        },
        {
            "label": "Browse Media",
            "key": "browse_Media"
        },
        {
            "label": "Browse Compass",
            "key": "browse_Compass"
        },
        {
            "label": "Browse Hooks",
            "key": "browse_Hooks"
        }
    ],
    "menus": [
        {
            "label": "Browse Menus",
            "key": "browse_Menus"
        },
        {
            "label": "Read Menus",
            "key": "read_Menus"
        },
        {
            "label": "Edit Menus",
            "key": "edit_Menus"
        },
        {
            "label": "Add Menus",
            "key": "add_Menus"
        },
        {
            "label": "Delete Menus",
            "key": "delete_Menus"
        }
    ],
    "roles": [
        {
            "label": "Browse Roles",
            "key": "browse_Roles"
        },
        {
            "label": "Read Roles",
            "key": "read_Roles"
        },
        {
            "label": "Edit Roles",
            "key": "edit_Roles"
        },
        {
            "label": "Add Roles",
            "key": "add_Roles"
        },
        {
            "label": "Delete Roles",
            "key": "delete_Roles"
        }
    ],
    "users": [
        {
            "label": "Browse Users",
            "key": "browse_Users"
        },
        {
            "label": "Read Users",
            "key": "read_Users"
        },
        {
            "label": "Edit Users",
            "key": "edit_Users"
        },
        {
            "label": "Add Users",
            "key": "add_Users"
        },
        {
            "label": "Delete Users",
            "key": "delete_Users"
        }
    ],
    "settings": [
        {
            "label": "Browse Settings",
            "key": "browse_Settings"
        },
        {
            "label": "Read Settings",
            "key": "read_Settings"
        },
        {
            "label": "Edit Settings",
            "key": "edit_Settings"
        },
        {
            "label": "Add Settings",
            "key": "add_Settings"
        },
        {
            "label": "Delete Settings",
            "key": "delete_Settings"
        }
    ],
    "categories": [
        {
            "label": "Browse Categories",
            "key": "browse_Categories"
        },
        {
            "label": "Read Categories",
            "key": "read_Categories"
        },
        {
            "label": "Edit Categories",
            "key": "edit_Categories"
        },
        {
            "label": "Add Categories",
            "key": "add_Categories"
        },
        {
            "label": "Delete Categories",
            "key": "delete_Categories"
        }
    ],
    "posts": [
        {
            "label": "Browse Posts",
            "key": "browse_Posts"
        },
        {
            "label": "Read Posts",
            "key": "read_Posts"
        },
        {
            "label": "Edit Posts",
            "key": "edit_Posts"
        },
        {
            "label": "Add Posts",
            "key": "add_Posts"
        },
        {
            "label": "Delete Posts",
            "key": "delete_Posts"
        }
    ],
    "pages": [
        {
            "label": "Browse Pages",
            "key": "browse_Pages"
        },
        {
            "label": "Read Pages",
            "key": "read_Pages"
        },
        {
            "label": "Edit Pages",
            "key": "edit_Pages"
        },
        {
            "label": "Add Pages",
            "key": "add_Pages"
        },
        {
            "label": "Delete Pages",
            "key": "delete_Pages"
        }
    ],
    "itemDetails": [
        {
            "label": "Browse Item Details",
            "key": "browse_ItemDetails"
        },
        {
            "label": "Read Item Details",
            "key": "read_ItemDetails"
        },
        {
            "label": "Edit Item Details",
            "key": "edit_ItemDetails"
        },
        {
            "label": "Add Item Details",
            "key": "add_ItemDetails"
        },
        {
            "label": "Delete Item Details",
            "key": "delete_ItemDetails"
        }
    ],
    "roomDetails": [
        {
            "label": "Browse Room Details",
            "key": "browse_RoomDetails"
        },
        {
            "label": "Read Room Details",
            "key": "read_RoomDetails"
        },
        {
            "label": "Edit Room Details",
            "key": "edit_RoomDetails"
        },
        {
            "label": "Add Room Details",
            "key": "add_RoomDetails"
        },
        {
            "label": "Delete Room Details",
            "key": "delete_RoomDetails"
        }
    ],
    "categoryDetails": [
        {
            "label": "Browse Category Details",
            "key": "browse_CategoryDetails"
        },
        {
            "label": "Read Category Details",
            "key": "read_CategoryDetails"
        },
        {
            "label": "Edit Category Details",
            "key": "edit_CategoryDetails"
        },
        {
            "label": "Add Category Details",
            "key": "add_CategoryDetails"
        },
        {
            "label": "Delete Category Details",
            "key": "delete_CategoryDetails"
        }
    ],
    "menuDetails": [
        {
            "label": "Browse Menu Details",
            "key": "browse_MenuDetails"
        },
        {
            "label": "Read Menu Details",
            "key": "read_MenuDetails"
        },
        {
            "label": "Edit Menu Details",
            "key": "edit_MenuDetails"
        },
        {
            "label": "Add Menu Details",
            "key": "add_MenuDetails"
        },
        {
            "label": "Delete Menu Details",
            "key": "delete_MenuDetails"
        }
    ],
    "itemOptions": [
        {
            "label": "Browse Item Options",
            "key": "browse_ItemOptions"
        },
        {
            "label": "Read Item Options",
            "key": "read_ItemOptions"
        },
        {
            "label": "Edit Item Options",
            "key": "edit_ItemOptions"
        },
        {
            "label": "Add Item Options",
            "key": "add_ItemOptions"
        },
        {
            "label": "Delete Item Options",
            "key": "delete_ItemOptions"
        }
    ],
    "itemPreference": [
        {
            "label": "Browse Item Preference",
            "key": "browse_ItemPreference"
        },
        {
            "label": "Read Item Preference",
            "key": "read_ItemPreference"
        },
        {
            "label": "Edit Item Preference",
            "key": "edit_ItemPreference"
        },
        {
            "label": "Add Item Preference",
            "key": "add_ItemPreference"
        },
        {
            "label": "Delete Item Preference",
            "key": "delete_ItemPreference"
        }
    ],
    "itemPreferences": [
        {
            "label": "Browse Item Preferences",
            "key": "browse_ItemPreferences"
        },
        {
            "label": "Read Item Preferences",
            "key": "read_ItemPreferences"
        },
        {
            "label": "Edit Item Preferences",
            "key": "edit_ItemPreferences"
        },
        {
            "label": "Add Item Preferences",
            "key": "add_ItemPreferences"
        },
        {
            "label": "Delete Item Preferences",
            "key": "delete_ItemPreferences"
        }
    ],
    "formTypes": [
        {
            "label": "Browse Form Types",
            "key": "browse_FormTypes"
        },
        {
            "label": "Read Form Types",
            "key": "read_FormTypes"
        },
        {
            "label": "Edit Form Types",
            "key": "edit_FormTypes"
        },
        {
            "label": "Add Form Types",
            "key": "add_FormTypes"
        },
        {
            "label": "Delete Form Types",
            "key": "delete_FormTypes"
        }
    ],
    "orderDetails": [
        {
            "label": "Browse Order Details",
            "key": "browse_OrderDetails"
        },
        {
            "label": "Read Order Details",
            "key": "read_OrderDetails"
        },
        {
            "label": "Edit Order Details",
            "key": "edit_OrderDetails"
        },
        {
            "label": "Add Order Details",
            "key": "add_OrderDetails"
        },
        {
            "label": "Delete Order Details",
            "key": "delete_OrderDetails"
        }
    ]
}
  

export const mockDataTeam = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    access: "admin",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    access: "manager",
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    access: "user",
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    age: 16,
    phone: "(921)425-6742",
    access: "admin",
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    age: 31,
    phone: "(421)445-1189",
    access: "user",
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    age: 150,
    phone: "(232)545-6483",
    access: "manager",
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    age: 44,
    phone: "(543)124-0123",
    access: "user",
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    age: 36,
    phone: "(222)444-5555",
    access: "user",
  },
  {
    id: 9,
    name: "Harvey Roxie",
    email: "harveyroxie@gmail.com",
    age: 65,
    phone: "(444)555-6239",
    access: "admin",
  },
];

export const mockDataRomm = [
  {
    id: 1,
    unitNumber: 101,
    resident_name: "Resident 1",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Soft",
    special_instruction: "Allergic to nuts",
    active: false
  },
  {
    id: 2,
    unitNumber: 102,
    resident_name: "Resident 2",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Regular",
    special_instruction: "None",
    active: true
  },
  {
    id: 3,
    unitNumber: 103,
    resident_name: "Resident 3",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Pureed",
    special_instruction: "Low sugar diet",
    active: true
  },
  {
    id: 4,
    unitNumber: 104,
    resident_name: "Resident 4",
    language_preference: "chi",
    occupancy: 3,
    food_texture: "Regular",
    special_instruction: "Vegetarian",
    active: false
  },
  {
    id: 5,
    unitNumber: 105,
    resident_name: "Resident 5",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Soft",
    special_instruction: "None",
    active: true
  },
  {
    id: 6,
    unitNumber: 106,
    resident_name: "Resident 6",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Pureed",
    special_instruction: "Gluten-free",
    active: true
  },
  {
    id: 7,
    unitNumber: 107,
    resident_name: "Resident 7",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Regular",
    special_instruction: "Low salt",
    active: false
  },
  {
    id: 8,
    unitNumber: 108,
    resident_name: "Resident 8",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Soft",
    special_instruction: "Allergic to dairy",
    active: true
  },
  {
    id: 9,
    unitNumber: 109,
    resident_name: "Resident 9",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Pureed",
    special_instruction: "None",
    active: true
  },
  {
    id: 10,
    unitNumber: 110,
    resident_name: "Resident 10",
    language_preference: "chi",
    occupancy: 3,
    food_texture: "Soft",
    special_instruction: "Diabetic",
    active: false
  },
  {
    id: 11,
    unitNumber: 111,
    resident_name: "Resident 11",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Regular",
    special_instruction: "None",
    active: true
  },
  {
    id: 12,
    unitNumber: 112,
    resident_name: "Resident 12",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Soft",
    special_instruction: "Vegan",
    active: true
  },
  {
    id: 13,
    unitNumber: 113,
    resident_name: "Resident 13",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Pureed",
    special_instruction: "Allergic to shellfish",
    active: false
  },
  {
    id: 14,
    unitNumber: 114,
    resident_name: "Resident 14",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Regular",
    special_instruction: "None",
    active: true
  },
  {
    id: 15,
    unitNumber: 115,
    resident_name: "Resident 15",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Soft",
    special_instruction: "None",
    active: true
  },
  {
    id: 16,
    unitNumber: 116,
    resident_name: "Resident 16",
    language_preference: "chi",
    occupancy: 3,
    food_texture: "Pureed",
    special_instruction: "Low cholesterol",
    active: false
  },
  {
    id: 17,
    unitNumber: 117,
    resident_name: "Resident 17",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Regular",
    special_instruction: "Allergic to peanuts",
    active: true
  },
  {
    id: 18,
    unitNumber: 118,
    resident_name: "Resident 18",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Soft",
    special_instruction: "Halal only",
    active: true
  },
  {
    id: 19,
    unitNumber: 119,
    resident_name: "Resident 19",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Pureed",
    special_instruction: "None",
    active: false
  },
  {
    id: 20,
    unitNumber: 120,
    resident_name: "Resident 20",
    language_preference: "chi",
    occupancy: 3,
    food_texture: "Soft",
    special_instruction: "Kosher",
    active: true
  },
  {
    id: 21,
    unitNumber: 121,
    resident_name: "Resident 21",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Regular",
    special_instruction: "None",
    active: true
  },
  {
    id: 22,
    unitNumber: 122,
    resident_name: "Resident 22",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Pureed",
    special_instruction: "No spicy food",
    active: false
  },
  {
    id: 23,
    unitNumber: 123,
    resident_name: "Resident 23",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Soft",
    special_instruction: "Allergic to soy",
    active: true
  },
  {
    id: 24,
    unitNumber: 124,
    resident_name: "Resident 24",
    language_preference: "chi",
    occupancy: 2,
    food_texture: "Regular",
    special_instruction: "None",
    active: true
  },
  {
    id: 25,
    unitNumber: 125,
    resident_name: "Resident 25",
    language_preference: "eng",
    occupancy: 1,
    food_texture: "Soft",
    special_instruction: "Vegetarian",
    active: false
  }
];

export const mockDataCategories = [
  {
    id: 1,
    categoryName: "LUNCH ENTREE",
    categoryChineseName: "Resident 1",
    categoryType: "lunch",
    parentId: "LunchEntree",
  },
  {
    id: 2,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 2",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 3,
    categoryName: "DINNER DESSERT",
    categoryChineseName: "Resident 3",
    categoryType: "dinner",
    parentId: "dinnerDessert",
  },
  {
    id: 4,
    categoryName: "LUNCH ALTERNATIVE",
    categoryChineseName: "Resident 4",
    categoryType: "lunch",
    parentId: "LunchAlternative",
  },
  {
    id: 5,
    categoryName: "DINNER ENTREE",
    categoryChineseName: "Resident 5",
    categoryType: "dinner",
    parentId: "dinnerEntree",
  },
  {
    id: 6,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 6",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 7,
    categoryName: "LUNCH SOUP",
    categoryChineseName: "Resident 7",
    categoryType: "lunch",
    parentId: "lunchSoup",
  },
  {
    id: 8,
    categoryName: "DINNER ALTERNATIVE",
    categoryChineseName: "Resident 8",
    categoryType: "dinner",
    parentId: "dinnerAlternative",
  },
  {
    id: 9,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 9",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 10,
    categoryName: "LUNCH ENTREE",
    categoryChineseName: "Resident 10",
    categoryType: "lunch",
    parentId: "LunchEntree",
  },
  {
    id: 11,
    categoryName: "DINNER ENTREE",
    categoryChineseName: "Resident 11",
    categoryType: "dinner",
    parentId: "dinnerEntree",
  },
  {
    id: 12,
    categoryName: "LUNCH ALTERNATIVE",
    categoryChineseName: "Resident 12",
    categoryType: "lunch",
    parentId: "LunchAlternative",
  },
  {
    id: 13,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 13",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 14,
    categoryName: "DINNER DESSERT",
    categoryChineseName: "Resident 14",
    categoryType: "dinner",
    parentId: "dinnerDessert",
  },
  {
    id: 15,
    categoryName: "LUNCH SOUP",
    categoryChineseName: "Resident 15",
    categoryType: "lunch",
    parentId: "lunchSoup",
  },
  {
    id: 16,
    categoryName: "DINNER ALTERNATIVE",
    categoryChineseName: "Resident 16",
    categoryType: "dinner",
    parentId: "dinnerAlternative",
  },
  {
    id: 17,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 17",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 18,
    categoryName: "LUNCH ENTREE",
    categoryChineseName: "Resident 18",
    categoryType: "lunch",
    parentId: "LunchEntree",
  },
  {
    id: 19,
    categoryName: "DINNER ENTREE",
    categoryChineseName: "Resident 19",
    categoryType: "dinner",
    parentId: "dinnerEntree",
  },
  {
    id: 20,
    categoryName: "LUNCH ALTERNATIVE",
    categoryChineseName: "Resident 20",
    categoryType: "lunch",
    parentId: "LunchAlternative",
  },
  {
    id: 21,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 21",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
  {
    id: 22,
    categoryName: "DINNER DESSERT",
    categoryChineseName: "Resident 22",
    categoryType: "dinner",
    parentId: "dinnerDessert",
  },
  {
    id: 23,
    categoryName: "LUNCH SOUP",
    categoryChineseName: "Resident 23",
    categoryType: "lunch",
    parentId: "lunchSoup",
  },
  {
    id: 24,
    categoryName: "DINNER ALTERNATIVE",
    categoryChineseName: "Resident 24",
    categoryType: "dinner",
    parentId: "dinnerAlternative",
  },
  {
    id: 25,
    categoryName: "BREAKFAST DAILY SPECIAL",
    categoryChineseName: "Resident 25",
    categoryType: "breakfast",
    parentId: "breakfastDailySpecial",
  },
];

export const mockDataItems = [
  {
    id: 1,
    itemName: "Tofu Stir Fry",
    itemChineseName: "豆腐炒",
    category: "breakfastDailySpecial",
    isAllDay: false,
    options: "rice",
    preference: "lessSalt",
    image: null,
  },
  {
    id: 2,
    itemName: "Chicken Noodle Soup",
    itemChineseName: "鸡汤面",
    category: "lunchSoup",
    isAllDay: true,
    options: "noodles",
    preference: "lessOil",
    image: null,
  },
  {
    id: 3,
    itemName: "Sweet and Sour Pork",
    itemChineseName: "糖醋里脊",
    category: "dinnerEntree",
    isAllDay: false,
    options: "yamFries",
    preference: "noRice",
    image: null,
  },
  {
    id: 4,
    itemName: "Fried Rice",
    itemChineseName: "炒饭",
    category: "LunchEntree",
    isAllDay: true,
    options: "rice",
    preference: "lessOil",
    image: null,
  },
  {
    id: 5,
    itemName: "Veggie Spring Rolls",
    itemChineseName: "素春卷",
    category: "LunchAlternative",
    isAllDay: false,
    options: "yamFries",
    preference: "lessSalt",
    image: null,
  },
  {
    id: 6,
    itemName: "Steamed Fish",
    itemChineseName: "清蒸鱼",
    category: "dinnerAlternative",
    isAllDay: true,
    options: "rice",
    preference: "lessSugar",
    image: null,
  },
  {
    id: 7,
    itemName: "Sesame Balls",
    itemChineseName: "芝麻球",
    category: "dinnerDessert",
    isAllDay: false,
    options: "noodles",
    preference: "noRice",
    image: null,
  },
  {
    id: 8,
    itemName: "Mapo Tofu",
    itemChineseName: "麻婆豆腐",
    category: "LunchEntree",
    isAllDay: true,
    options: "rice",
    preference: "lessOil",
    image: null,
  },
  {
    id: 9,
    itemName: "Eggplant Garlic Sauce",
    itemChineseName: "鱼香茄子",
    category: "dinnerEntree",
    isAllDay: false,
    options: "yamFries",
    preference: "lessSalt",
    image: null,
  },
  {
    id: 10,
    itemName: "Wonton Soup",
    itemChineseName: "馄饨汤",
    category: "lunchSoup",
    isAllDay: true,
    options: "noodles",
    preference: "lessSugar",
    image: null,
  },
  {
    id: 11,
    itemName: "Chow Mein",
    itemChineseName: "炒面",
    category: "LunchEntree",
    isAllDay: false,
    options: "noodles",
    preference: "noRice",
    image: null,
  },
  {
    id: 12,
    itemName: "Braised Tofu",
    itemChineseName: "红烧豆腐",
    category: "dinnerAlternative",
    isAllDay: true,
    options: "rice",
    preference: "lessSalt",
    image: null,
  },
  {
    id: 13,
    itemName: "Stir-Fried Broccoli",
    itemChineseName: "炒西兰花",
    category: "LunchAlternative",
    isAllDay: false,
    options: "yamFries",
    preference: "lessOil",
    image: null,
  },
  {
    id: 14,
    itemName: "Fried Taro Rolls",
    itemChineseName: "香芋卷",
    category: "dinnerDessert",
    isAllDay: true,
    options: "rice",
    preference: "noRice",
    image: null,
  },
  {
    id: 15,
    itemName: "Chicken Fried Rice",
    itemChineseName: "鸡炒饭",
    category: "breakfastDailySpecial",
    isAllDay: true,
    options: "rice",
    preference: "lessSugar",
    image: null,
  },
  {
    id: 16,
    itemName: "Tofu Noodle Soup",
    itemChineseName: "豆腐汤面",
    category: "lunchSoup",
    isAllDay: false,
    options: "noodles",
    preference: "lessSalt",
    image: null,
  },
  {
    id: 17,
    itemName: "Orange Chicken",
    itemChineseName: "陈皮鸡",
    category: "dinnerEntree",
    isAllDay: true,
    options: "yamFries",
    preference: "lessOil",
    image: null,
  },
  {
    id: 18,
    itemName: "Kung Pao Chicken",
    itemChineseName: "宫保鸡丁",
    category: "LunchEntree",
    isAllDay: false,
    options: "rice",
    preference: "lessSugar",
    image: null,
  },
  {
    id: 19,
    itemName: "Vegetable Dumplings",
    itemChineseName: "素饺子",
    category: "LunchAlternative",
    isAllDay: true,
    options: "yamFries",
    preference: "noRice",
    image: null,
  },
  {
    id: 20,
    itemName: "Mango Pudding",
    itemChineseName: "芒果布丁",
    category: "dinnerDessert",
    isAllDay: false,
    options: "noodles",
    preference: "lessSalt",
    image: null,
  }
];


export const mockOptions = [
  { id: 1, optionsName: "Yam Fries ( extra $5)", optionsChineseName: "豆腐炒", isPaidItem: false },
  { id: 2, optionsName: "Noodles", optionsChineseName: "糖醋里脊", isPaidItem: true },
  { id: 3, optionsName: "Rice", optionsChineseName: "炒饭", isPaidItem: true },
];

export const mockPreferences = [
  { id: 1, preferencesName: "Less Oil", preferencesChineseName: "豆腐炒" },
  { id: 2, preferencesName: "Less Salt", preferencesChineseName: "豆腐炒" },
  { id: 3, preferencesName: "Less Sugar", preferencesChineseName: "豆腐炒" },
  { id: 4, preferencesName: "No Rice", preferencesChineseName: "豆腐炒" }
];


export const mockMenuDetailsData= [{
  "id":1,
  "menuName": "Items 1",
  "date": "2025-05-01",
  "breakfast": true,
  "lunch": true,
  "dinner": true,
  "selectedBreakfastItems": {
      "dailySpecial": [
          {
              "id": 1,
              "label": "Buttermilk Pancakes with Chicken Sausage, Oatmeal ..."
          }
      ],
      "alternatives": [
          {
              "id": 1,
              "label": "Buttermilk Pancakes with Chicken Sausage, Oatmeal ..."
          }
      ]
  },
  "selectedLunchItems": {
      "lunchSoup": [
          {
              "id": 211,
              "label": "BC Corn with Herb Oil Soup"
          }
      ],
      "lunchEntree": [
          {
              "id": 513,
              "label": "BLT Sandwich with Fries"
          }
      ],
      "lunchDessert": [],
      "lunchAlternatives": []
  },
  "selectedDinnerItems": {
      "dinnerEntree": [],
      "dinnerAlternatives": [
          {
              "id": 701,
              "label": "Pan Seared Chicken Breast..."
          }
      ],
      "dinnerDessert": []
  }
},{
  "id":2,
  "menuName": "Items 2",
  "date": "2025-05-02",
  "breakfast": true,
  "lunch": false,
  "dinner": true,
  "selectedBreakfastItems": {
      "dailySpecial": [
          {
              "id": 5,
              "label": "Egg, Mushroom, Turkey Bacon, Whole Wheat and Oatme..."
          },
          {
              "id": 4,
              "label": "Whole Wheat..."
          }
      ],
      "alternatives": [
          {
              "id": 5,
              "label": "Egg, Mushroom, Turkey Bacon, Whole Wheat and Oatme..."
          },
          {
              "id": 4,
              "label": "Whole Wheat..."
          }
      ]
  },
  "selectedLunchItems": {
      "lunchSoup": [],
      "lunchEntree": [],
      "lunchDessert": [],
      "lunchAlternatives": []
  },
  "selectedDinnerItems": {
      "dinnerEntree": [
          {
              "id": 577,
              "label": "Baked Chicken Cutlet with Gravy, Roasted Potatoes and Green Salad"
          },
          {
              "id": 578,
              "label": "Baked Herb Crusted Fish with Roasted Vegetables and Potatoes"
          },
          {
              "id": 579,
              "label": "Baked Honey Garlic Ginger Salmon with Mashed Potato and Roasted Zucchini"
          }
      ],
      "dinnerAlternatives": [],
      "dinnerDessert": []
  }
}]

export const mockBreakFastDailySpecial = [
  { id: 1, label: "Buttermilk Pancakes with Chicken Sausage, Oatmeal ..." },
  { id: 2, label: "Egg White Frittata with Baked Beans and Oatmeal & ..." },
  { id: 3, label: "Egg White Frittata with Baked Beans, Scone,Fruits ..." },
  { id: 4, label: "Egg White Frittata with Scone and Fruits & Oatmeal..." },
  { id: 5, label: "Egg, Mushroom, Turkey Bacon, Whole Wheat and Oatme..." },
  { id: 6, label: "Egg, Turkey Bacon, Hashbrowns, Whole Wheat and Oat..." },
  { id: 7, label: "Egg, Turkey Bacon, Roasted Potatoes, Whole Wheat a..." },
  { id: 8, label: "Egg,Whole Wheat Toast , Oatmeal White bread..." },
  { id: 9, label: "French Toast with Maple Syrup, Oatmeal & Fruits..." },
  { id: 10, label: "Ham & Eggs Benedict with Breakfast Potatoes and Fr..." },
  { id: 11, label: "Scrambled Egg with Baked Beans, Croissant and Frui..." },
  { id: 12, label: "Shrimp Benny with Hollandaise and Breakfast Potato.." },
  { id: 13, label: "Smoke Salmon Egg Benny with Hollandaise and Breakf..." },
  { id: 14, label: "Turkey and Egg Benny with Hollandaise, Breakfast P..." },
  { id: 15, label: "Western Omelette-Onion, Mushroom, Pepper,Whole Whe..." },
]

export const mockBreakFastAlternatives=[
  {id:1, label:"Choice of Egg ..."},
  {id:2, label:"Fruit..."},
  {id:3, label:"Oatmeal..."},
  {id:4, label:"Whole Wheat..."},
  {id:5, label:"Toast..."},
]

export const  mockLunchSoups = [
  { id: 211, label: "BC Corn with Herb Oil Soup" },
  { id: 198, label: "Beef and Barley Soup" },
  { id: 226, label: "Beetroot Vegetable Soup" },
  { id: 129, label: "Carrot Soup" },
  { id: 130, label: "Cauliflower with Herb Oil Soup" },
  { id: 270, label: "Celery Soup with Hemp Seed" },
  { id: 20,  label: "Chef's Double Boiled Soup" },
  { id: 201, label: "Chicken Noodles with Vegetables" },
  { id: 240, label: "Clam Chowder Soup" },
  { id: 268, label: "Cream of Broccoli" },
  { id: 269, label: "Egg Drop Soup" },
  { id: 221, label: "French Onion Soup" },
  { id: 197, label: "Leek and Potato Soup" },
  { id: 334, label: "Minestrone with Millet Soup" },
  { id: 200, label: "Minestrone with Quinoa" },
  { id: 128, label: "Mushroom Soup" },
  { id: 216, label: "Navy Bean Soup" },
  { id: 199, label: "Seafood Chowder" },
  { id: 470, label: "Soup of the Day" },
  { id: 131, label: "Spinach and Red Lentil Soup" },
  { id: 206, label: "Split Pea and Ham Soup" },
  { id: 267, label: "Sweet Potato, Red Onion & Coconut" },
  { id: 117, label: "Vegetable and Quinoa Soup" }
];
export const mocklunchEntree = [
  { id: 507, label: "Avocado & Egg Sandwich with Green Salad & Yam Fries" },
  { id: 508, label: "BBQ Beef Wrap with Salad" },
  { id: 509, label: "BBQ Chicken Quesadillia with Mixed Green Salad" },
  { id: 510, label: "BBQ Pork and Fried Egg with Steamed Rice with Steamed Choy Sum" },
  { id: 511, label: "BBQ Pulled Pork Burger with Fries" },
  { id: 512, label: "Beyond Meat Cheeseburger with Fries" },
  { id: 513, label: "BLT Sandwich with Fries" },
  { id: 514, label: "Braised Beef Brisket with Noodle in Soup and Steamed Chinese cabbage" },
  { id: 515, label: "Braised Chicken Noodle in Soup and Steamed Bok Choy" },
  { id: 516, label: "Braised Lion's Head Meatballs, Gai Lan and Rice" },
  { id: 517, label: "Braised Rice Noodle with Shredded Chicken and Preserved Vegetable and Steamed Choy Sum" },
  { id: 518, label: "Chicken and Tofu Udon in soup with Bean Sprouts and Spinach" },
  { id: 519, label: "Chicken and Vegetable Chow Mein" },
  { id: 520, label: "Chicken Mac and Cheese with Salad" },
  { id: 521, label: "Chicken Shakshuka with Grilled Bread" },
  { id: 522, label: "Chicken With Black Beans on Rice and Steamed Broccoli" },
  { id: 523, label: "Classic Turkey Sandwich (Whole Wheat) with Tomato and French Fries" },
  { id: 524, label: "Cliantro Lime Chicken Steak with Iceberg Ranch salad" },
  { id: 525, label: "Clubhouse sandwich, (Ham, bacon, lettuce, tomato, egg) with Fries" },
  { id: 526, label: "Croque Monsieur Sandwich ( Ham, cheddar, bechamel) with green salad" },
  { id: 527, label: "Diced Chicken or Tofu with Cream Corn Sauce on Rice and Choy Sum" },
  { id: 528, label: "Dim Sum served with Steamed Gai Lan" },
  { id: 529, label: "Dumpling Noodle in Soup and Chinese Cabbage" },
  { id: 530, label: "Dumpling with Rice Noodles in Soup served with Steamed Choy Sum" },
  { id: 531, label: "Egg Foo Young with Shrimp or tofu on Rice and Steamed Choy Sum" },
  { id: 532, label: "Eggplant with Minced Chicken or Egg on Rice  with Steamed Choy Sum" },
  { id: 533, label: "Filet-O-Fish Burger served with Coleslaw" },
  { id: 534, label: "Fish & Chips with Coleslaw Served with Tartar Sauce" },
  { id: 535, label: "Fish Ball Daikon Noodles in Soup and Steamed Chinese Cabbage" },
  { id: 536, label: "Fish Filet with Cream Corn Sauce on Rice and Steamed Choy Sum" },
  { id: 537, label: "Fried Chicken Burger With Green Salad" },
  { id: 538, label: "Fuzhou Fried Rice with Choy Sum (Meat, seafood and vegetables topped with egg fried rice)" },
  { id: 539, label: "Grilled Chicken Steak Sandwich with Green Salad" },
  { id: 540, label: "Ham & Cheese Sandwich with Green Salad" },
  { id: 541, label: "Hongkong Style Congee with Chinese Donut, Rice Roll and Steamed Bok Choy" },
  { id: 542, label: "Hot Dog (Chicken Sausage) with Cheddar Cheese, Coleslaw" },
  { id: 543, label: "Japanese Pork Chop with Steamed Broccoli on Rice" },
  { id: 544, label: "Mild Chili Chicken Hotdog  with Coleslaw" },
  { id: 545, label: "Mild Curry Pork Chop with Broccoli on Rice" },
  { id: 546, label: "Minced Beef with Tofu and Tomato Rice Noodle in Soup with Steamed Bok Choy" },
  { id: 547, label: "Mix Veggie Fry Rice and Steamed Choy Sum" },
  { id: 548, label: "Montreal Beef Sandwich with Yam Fries" },
  { id: 549, label: "Mushroom and Bacon Quiche with Ceasar Salad" },
  { id: 550, label: "Mushroom and Cheese Croissant with Caesar salad" },
  { id: 551, label: "Pan fried Shredded Chicken with Zucchini served with rice" },
  { id: 552, label: "Prawn and Avacado Tacos with Coleslaw" },
  { id: 553, label: "Preserved vegetable with Fish Served with Rice and Steamed Choy Sum" },
  { id: 554, label: "Pulled Pork Wrap with Hashbrowns" },
  { id: 555, label: "Seaweed, Cuttlefish Ball, Choy Sum with Noodle in Soup" },
  { id: 556, label: "Shanghaiese Stir Fried Noodles and Steamed Spinach" },
  { id: 557, label: "Sheppard's Pie with Spring Salad" },
  { id: 558, label: "Shredded chicken burger, Onion, lettuce, tomato, BBQ Mayoannaise, Caesar salad" },
  { id: 559, label: "Shrimp and Scrambled Egg Sauce on Stir Fried Rice Noodle and Steamed Choy Sum" },
  { id: 560, label: "Shrimp with Scrambled Egg on Rice and Steamed Bok Choy" },
  { id: 561, label: "Smoked Salmon Croissant with Tomato Salsa" },
  { id: 562, label: "Soba Dashi with Chicken, Seaweed" },
  { id: 563, label: "Steamed Three Colored Eggs with Rice and Steamed Spinach" },
  { id: 564, label: "Stir Fried Pork with Rice" },
  { id: 565, label: "Taiwanese Braised Minced  Pork or Tofu on Rice and Steamed Bok Choy" },
  { id: 566, label: "Teriyaki Beef Burger with Coleslaw" },
  { id: 567, label: "Teriyaki Chicken Burger with Onion Rings" },
  { id: 568, label: "Terriyaki Chicken Donburi with Carrot and Broccoli" },
  { id: 569, label: "Thai Chicken Steak with Lettuce Carrot salad and Roasted Potato" },
  { id: 570, label: "Tomato and Egg on Rice and Steamed Gai Lan" },
  { id: 571, label: "Tuna & Avocado Sandwich with Salad" },
  { id: 572, label: "Tuna Melt Sandwich with Salad" },
  { id: 573, label: "Turkey Cheese Melt Sandwich with Fries" },
  { id: 574, label: "Turkey Meat Balls with Tomato Sauce pasta and  Salad" },
  { id: 575, label: "Vietnamese Chicken Meatball Pho" },
  { id: 576, label: "Wonton Noodle in Soup with Chinese Cabbage" }
];

export const mocklunchDessert = [
  { id: 701, label: "Chef Choice..." }
]

export const mocklunchAlternatives = [
  { id: 801, label: "Cheese Omelette..." },
  { id: 801, label: "Egg Salad Sandwich..." },
  { id: 801, label: "Ham and Cheese Sandwich..." },
  { id: 801, label: "Turkey Sandwich..." },
]

export const mockDinnerEntree = [
  { id: 577, label: "Baked Chicken Cutlet with Gravy, Roasted Potatoes and Green Salad" },
  { id: 578, label: "Baked Herb Crusted Fish with Roasted Vegetables and Potatoes" },
  { id: 579, label: "Baked Honey Garlic Ginger Salmon with Mashed Potato and Roasted Zucchini" },
  { id: 580, label: "Baked Miso Fish with Mushrooms and Spinach served with Rice and Shiitake Broth" },
  { id: 581, label: "Baked Seafood Pasta with Broccoli and Bell Peppers" },
  { id: 582, label: "BBQ Chicken Leg served with Corn, Green Beans and Corn Bread" },
  { id: 583, label: "BBQ Ribs with Pineapple Salad and Roasted Vegetable" },
  { id: 584, label: "Bead Curd Vegetable in Fish Soup served with Rice" },
  { id: 585, label: "Beef Tenderlion with Prawns and Steamed Broccoli" },
  { id: 586, label: "Beef Tenderloin and Potato Stir Fry with Broccoli" },
  { id: 587, label: "Beef Tenderloin in Tangerine Peel Sauce" },
  { id: 588, label: "Bolognese (Tomato beef  suace) with Pasta and Broccoli" },
  { id: 589, label: "Braised Fish Filet with Tofu on Rice and Steamed Spinach" },
  { id: 590, label: "Braised Pork Belly with Pickled Vegetables" },
  { id: 591, label: "Braised Tofu with Rice and Steamed Bok Choy" },
  { id: 592, label: "Chicken Cacciatore served with Salad and Garlic Bread" },
  { id: 593, label: "Chicken Fricassée Pasta (Mushroom, Bell Pepper)" },
  { id: 594, label: "Chicken Parmesan with Pasta with Green Salad" },
  { id: 595, label: "Confit Duck Leg with White Bean Stew" },
  { id: 596, label: "Deep Fried Porkchop with Dried Garlic" },
  { id: 597, label: "Diced Chicken and Tofu cooked with Salted Fish served with Rice and steamed Chinese Cabbage" },
  { id: 598, label: "Drunken Chicken on Rice and steamed Gai Lan" },
  { id: 599, label: "Enoki Mushrooms with Egg Tofu and Choy Sum" },
  { id: 600, label: "Fish Soup Noodles (Fish Cake, Fish Ball, Mushroom, Tofu Puff, Fresh Bean Curd and Vegetables)" },
  { id: 601, label: "Golden Prawn wtih Steamed Bok Choy" },
  { id: 602, label: "Grilled Chicken with Roast Potatoes" },
  { id: 603, label: "Grilled Lamb Shoulder with Garlic Naan Bread and Roasted Vegetables" },
  { id: 604, label: "Hainanese Chicken on Rice with Choy Sum" },
  { id: 605, label: "Honey Garlic Chicken with Broccoli and Rice" },
  { id: 606, label: "Lemon Fish Pie with Roasted Carrot and Bell Pepper" },
  { id: 607, label: "Lemon Rosemary Chicken with Roasted Potato,  Cherry Tomato and Zucchini" },
  { id: 608, label: "Macanese (Portuguese) Chicken Curry with Rice (Peanut, Coconut, Bell Pepper)" },
  { id: 609, label: "Mapo Tofu served with Rice and Steamed Bok Choy" },
  { id: 610, label: "Pan Fried Chicken, Ratatouille & Garlic Herb Potato" },
  { id: 611, label: "Pan Seared Fish Filet with Warm Couscous Salad" },
  { id: 612, label: "Pan Seared Fish with Bok Choy and Rice" },
  { id: 613, label: "Pan Seared Salmon with Almond Caper Sauce and Roasted Yam" },
  { id: 614, label: "Pan Seared Salmon With Lemon Butter Sauce and Pan fried Carrot and Zucchini" },
  { id: 615, label: "Poached Salmon with Hollandaise , Asparagus and Rice Pilaf (Carrot, Bell Pepper)" },
  { id: 616, label: "Pork Medallions with Braised Cabbage and Roasted Cauliflour" },
  { id: 617, label: "Prawn, Baby Scallop and Spinach Risotto with Tomato Sauce" },
  { id: 618, label: "Prawns with Tomato Sauce on Rice and steamed Broccoli" },
  { id: 619, label: "Red Wine Braised Pork with Lemon Thyme, Yam Puree and Roasted Tomato" },
  { id: 620, label: "Roast Turkey with Warm Stuffing and Mixed Greens" },
  { id: 621, label: "Roasted Stuffed Pork Tenderloin (Vegetable and Shrimp) with Asparagus Salad" },
  { id: 622, label: "Salisbury Steak with Mashed Potato and Roasted Vegetables" },
  { id: 623, label: "Salmon Cream Stew with Rice Pilaf" },
  { id: 624, label: "Salt Baked Chicken with Rice and Steamed Bok Choy" },
  { id: 625, label: "Seafood Fried Rice with Steamed Gai Lan" },
  { id: 626, label: "Soy Glazed Fish Fillet with Agedashi Tofu, Seaweed Soup and Rice" },
  { id: 627, label: "Soy Sauce Chicken with Steamed Bok Choy on Rice" },
  { id: 628, label: "Steamed chicken with Cordyceps Flower on Rice with steamed Bok Choy" },
  { id: 629, label: "Steamed Chicken with Dried Lily Bud and Cloud Ear Fungus served with Rice and steamed Choy Sum" },
  { id: 630, label: "Steamed Chicken with Ginger and Green Onion" },
  { id: 631, label: "Steamed Fish With Tofu and Black Bean Sauce with Rice and steamed Choy Sum" },
  { id: 632, label: "Steamed Garlic Shrimp and Vermicelli with Rice" },
  { id: 633, label: "Steamed Pork Patty with Preserved Vegetable and Rice and Gai Lan" },
  { id: 634, label: "Stir Fried Bitter Melon with Minced Chicken" },
  { id: 635, label: "Stir Fried Cashew Chicken" },
  { id: 636, label: "Sweet and Sour Fish with Rice and steamed Bok Choy" },
  { id: 637, label: "Sweet and Sour Pork with Pineapple and Rice and steamed Choy Sum" },
  { id: 638, label: "Taiwanese-Three Cup Chicken on Rice and steamed Bok Choy" },
  { id: 639, label: "Truffle Mushroom Pasta with Garlic Bread and Green Salad." },
  { id: 640, label: "Tuscan Butter Salmon Pasta (Spinach , Tomato, Bell Pepper)" },
  { id: 641, label: "Vegetable with Salted and Preserved Eggs" },
  { id: 642, label: "White Wine Seafood Pasta (Clam, Shrimp, Baby Scallop) and Broccoli" }
];

export const mockDinnerAlternatives = [
  { id: 701, label: "Pan Seared Chicken Breast..." },
  { id: 702, label: "Pan Seared Fish..." },
  { id: 703, label: "Sandwich of the Day..." },
  { id: 704, label: "Vegetarian Plate..." },
]

export const mockDinnerDessert = [
  { id: 301, label: "Cake..." },
  { id: 302, label: "Chocolate Moussee..." },
  { id: 303, label: "Coconut Jelly..." },
  { id: 304, label: "Donut..." },
  { id: 305, label: "Grass jelly with milk..." },
  { id: 306, label: "Ice cream ( Low sugar)..." },
  { id: 307, label: "Jelly ( Low sugar)..." },
  { id: 308, label: "Jelly (Low sugar)..." },
  { id: 309, label: "Pudding..." },
  { id: 310, label: "Red Bean Soup..." },
]



export const mockDataContacts = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    address: "0912 Won Street, Alabama, SY 10001",
    city: "New York",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    address: "1234 Main Street, New York, NY 10001",
    city: "New York",
    zipCode: "13151",
    registrarId: 123512,
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    address: "3333 Want Blvd, Estanza, NAY 42125",
    city: "New York",
    zipCode: "87281",
    registrarId: 4132513,
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    age: 16,
    phone: "(921)425-6742",
    address: "1514 Main Street, New York, NY 22298",
    city: "New York",
    zipCode: "15551",
    registrarId: 123512,
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    age: 31,
    phone: "(421)445-1189",
    address: "11122 Welping Ave, Tenting, CD 21321",
    city: "Tenting",
    zipCode: "14215",
    registrarId: 123512,
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    age: 150,
    phone: "(232)545-6483",
    address: "1234 Canvile Street, Esvazark, NY 10001",
    city: "Esvazark",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    age: 44,
    phone: "(543)124-0123",
    address: "22215 Super Street, Everting, ZO 515234",
    city: "Evertin",
    zipCode: "51523",
    registrarId: 123512,
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    age: 36,
    phone: "(222)444-5555",
    address: "4123 Ever Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 512315,
  },
  {
    id: 9,
    name: "Harvey Roxie",
    email: "harveyroxie@gmail.com",
    age: 65,
    phone: "(444)555-6239",
    address: "51234 Avery Street, Cantory, ND 212412",
    city: "Colunza",
    zipCode: "111234",
    registrarId: 928397,
  },
  {
    id: 10,
    name: "Enteri Redack",
    email: "enteriredack@gmail.com",
    age: 42,
    phone: "(222)444-5555",
    address: "4123 Easer Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 533215,
  },
  {
    id: 11,
    name: "Steve Goodman",
    email: "stevegoodmane@gmail.com",
    age: 11,
    phone: "(444)555-6239",
    address: "51234 Fiveton Street, CunFory, ND 212412",
    city: "Colunza",
    zipCode: "1234",
    registrarId: 92197,
  },
];

export const mockDataInvoices = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    cost: "21.24",
    phone: "(665)121-5454",
    date: "03/12/2022",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    cost: "1.24",
    phone: "(421)314-2288",
    date: "06/15/2021",
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    cost: "11.24",
    phone: "(422)982-6739",
    date: "05/02/2022",
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    cost: "80.55",
    phone: "(921)425-6742",
    date: "03/21/2022",
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    cost: "1.24",
    phone: "(421)445-1189",
    date: "01/12/2021",
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    cost: "63.12",
    phone: "(232)545-6483",
    date: "11/02/2022",
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    cost: "52.42",
    phone: "(543)124-0123",
    date: "02/11/2022",
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    cost: "21.24",
    phone: "(222)444-5555",
    date: "05/02/2021",
  },
];

export const mockAccordionData = [
  {
    question: "How do I create a new user?",
    details:
      "To create a new user, navigate to the Users section in the admin dashboard. Click on the 'Add User' button and fill in the required information such as username, email, and password. Then, click on the 'Save' button to create the user.",
  },
  {
    question: "How can I manage permissions for users?",
    details:
      "To manage permissions for users, go to the Permissions section in the admin dashboard. Here, you can assign or revoke specific permissions for each user by selecting the user and adjusting their permissions accordingly.",
  },
  {
    question: "What is the process for adding a new product?",
    details:
      "To add a new product, navigate to the Products section in the admin dashboard. Click on the 'Add Product' button and fill in the details such as product name, description, price, and images. Finally, click on the 'Save' button to add the product.",
  },
  {
    question: "How do I update existing user information?",
    details:
      "To update existing user information, find the user in the Users section of the admin dashboard. Click on the user to view their details, then click on the 'Edit' button. Update the necessary information and click on the 'Save' button to apply the changes.",
  },
  {
    question: "What are the steps to delete a product?",
    details:
      "To delete a product, navigate to the Products section in the admin dashboard. Find the product you want to delete and click on the 'Delete' button. Confirm the action when prompted, and the product will be permanently removed from the system.",
  },
  {
    question: "How can I view sales reports?",
    details:
      "To view sales reports, go to the Reports section in the admin dashboard. Here, you can generate various reports such as sales by day, month, or year, top-selling products, and revenue trends.",
  },
  {
    question: "What options are available for managing customer orders?",
    details:
      "To manage customer orders, navigate to the Orders section in the admin dashboard. Here, you can view all orders, process pending orders, update order status, and manage order fulfillment and shipping details.",
  },
  {
    question: "How do I customize the appearance of the dashboard?",
    details:
      "To customize the appearance of the dashboard, go to the Settings section in the admin dashboard. Here, you can adjust various settings such as theme colors, layout options, and dashboard widgets.",
  },
  {
    question: "What security measures are in place to protect user data?",
    details:
      "We take security seriously and have implemented various measures to protect user data. These include encryption of sensitive information, regular security audits, and compliance with industry standards and regulations.",
  },
  {
    question: "How can I contact support for assistance?",
    details:
      "For assistance or support inquiries, please contact our customer support team via email at support@example.com or by phone at 1-800-123-4567. Our support team is available to assist you with any questions or issues you may have.",
  },
];

export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];

export const mockBarData = [
  {
    country: "AD",
    "hot dog": 137,
    "hot dogColor": "hsl(229, 70%, 50%)",
    burger: 96,
    burgerColor: "hsl(296, 70%, 50%)",
    kebab: 72,
    kebabColor: "hsl(97, 70%, 50%)",
    donut: 140,
    donutColor: "hsl(340, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 55,
    "hot dogColor": "hsl(307, 70%, 50%)",
    burger: 28,
    burgerColor: "hsl(111, 70%, 50%)",
    kebab: 58,
    kebabColor: "hsl(273, 70%, 50%)",
    donut: 29,
    donutColor: "hsl(275, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 109,
    "hot dogColor": "hsl(72, 70%, 50%)",
    burger: 23,
    burgerColor: "hsl(96, 70%, 50%)",
    kebab: 34,
    kebabColor: "hsl(106, 70%, 50%)",
    donut: 152,
    donutColor: "hsl(256, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 133,
    "hot dogColor": "hsl(257, 70%, 50%)",
    burger: 52,
    burgerColor: "hsl(326, 70%, 50%)",
    kebab: 43,
    kebabColor: "hsl(110, 70%, 50%)",
    donut: 83,
    donutColor: "hsl(9, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 81,
    "hot dogColor": "hsl(190, 70%, 50%)",
    burger: 80,
    burgerColor: "hsl(325, 70%, 50%)",
    kebab: 112,
    kebabColor: "hsl(54, 70%, 50%)",
    donut: 35,
    donutColor: "hsl(285, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 66,
    "hot dogColor": "hsl(208, 70%, 50%)",
    burger: 111,
    burgerColor: "hsl(334, 70%, 50%)",
    kebab: 167,
    kebabColor: "hsl(182, 70%, 50%)",
    donut: 18,
    donutColor: "hsl(76, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 80,
    "hot dogColor": "hsl(87, 70%, 50%)",
    burger: 47,
    burgerColor: "hsl(141, 70%, 50%)",
    kebab: 158,
    kebabColor: "hsl(224, 70%, 50%)",
    donut: 49,
    donutColor: "hsl(274, 70%, 50%)",
  },
];

export const mockStreamData = [
  {
    Raoul: 171,
    Josiane: 82,
    Marcel: 73,
    René: 134,
    Paul: 73,
    Jacques: 73,
  },
  {
    Raoul: 105,
    Josiane: 30,
    Marcel: 55,
    René: 16,
    Paul: 154,
    Jacques: 110,
  },
  {
    Raoul: 18,
    Josiane: 13,
    Marcel: 65,
    René: 111,
    Paul: 132,
    Jacques: 181,
  },
  {
    Raoul: 140,
    Josiane: 101,
    Marcel: 75,
    René: 60,
    Paul: 132,
    Jacques: 32,
  },
  {
    Raoul: 131,
    Josiane: 152,
    Marcel: 102,
    René: 69,
    Paul: 141,
    Jacques: 196,
  },
  {
    Raoul: 46,
    Josiane: 163,
    Marcel: 135,
    René: 50,
    Paul: 48,
    Jacques: 79,
  },
  {
    Raoul: 90,
    Josiane: 164,
    Marcel: 94,
    René: 51,
    Paul: 160,
    Jacques: 26,
  },
  {
    Raoul: 51,
    Josiane: 42,
    Marcel: 13,
    René: 121,
    Paul: 140,
    Jacques: 22,
  },
  {
    Raoul: 48,
    Josiane: 39,
    Marcel: 59,
    René: 15,
    Paul: 16,
    Jacques: 40,
  },
];

export const mockPieData = [
  {
    id: "hack",
    label: "hack",
    value: 239,
    color: "hsl(104, 70%, 50%)",
  },
  {
    id: "make",
    label: "make",
    value: 170,
    color: "hsl(162, 70%, 50%)",
  },
  {
    id: "go",
    label: "go",
    value: 322,
    color: "hsl(291, 70%, 50%)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 503,
    color: "hsl(229, 70%, 50%)",
  },
  {
    id: "scala",
    label: "scala",
    value: 584,
    color: "hsl(344, 70%, 50%)",
  },
];

export const mockLineData = [
  {
    id: "japan",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "plane",
        y: 101,
      },
      {
        x: "helicopter",
        y: 75,
      },
      {
        x: "boat",
        y: 36,
      },
      {
        x: "train",
        y: 216,
      },
      {
        x: "subway",
        y: 35,
      },
      {
        x: "bus",
        y: 236,
      },
      {
        x: "car",
        y: 88,
      },
      {
        x: "moto",
        y: 232,
      },
      {
        x: "bicycle",
        y: 281,
      },
      {
        x: "horse",
        y: 1,
      },
      {
        x: "skateboard",
        y: 35,
      },
      {
        x: "others",
        y: 14,
      },
    ],
  },
  {
    id: "france",
    color: tokens("dark").blueAccent[300],
    data: [
      {
        x: "plane",
        y: 212,
      },
      {
        x: "helicopter",
        y: 190,
      },
      {
        x: "boat",
        y: 270,
      },
      {
        x: "train",
        y: 9,
      },
      {
        x: "subway",
        y: 75,
      },
      {
        x: "bus",
        y: 175,
      },
      {
        x: "car",
        y: 33,
      },
      {
        x: "moto",
        y: 189,
      },
      {
        x: "bicycle",
        y: 97,
      },
      {
        x: "horse",
        y: 87,
      },
      {
        x: "skateboard",
        y: 299,
      },
      {
        x: "others",
        y: 251,
      },
    ],
  },
  {
    id: "us",
    color: tokens("dark").redAccent[200],
    data: [
      {
        x: "plane",
        y: 191,
      },
      {
        x: "helicopter",
        y: 136,
      },
      {
        x: "boat",
        y: 91,
      },
      {
        x: "train",
        y: 190,
      },
      {
        x: "subway",
        y: 211,
      },
      {
        x: "bus",
        y: 152,
      },
      {
        x: "car",
        y: 189,
      },
      {
        x: "moto",
        y: 152,
      },
      {
        x: "bicycle",
        y: 8,
      },
      {
        x: "horse",
        y: 197,
      },
      {
        x: "skateboard",
        y: 107,
      },
      {
        x: "others",
        y: 170,
      },
    ],
  },
];

export const mockGeographyData = [
  {
    id: "AFG",
    value: 520600,
  },
  {
    id: "AGO",
    value: 949905,
  },
  {
    id: "ALB",
    value: 329910,
  },
  {
    id: "ARE",
    value: 675484,
  },
  {
    id: "ARG",
    value: 432239,
  },
  {
    id: "ARM",
    value: 288305,
  },
  {
    id: "ATA",
    value: 415648,
  },
  {
    id: "ATF",
    value: 665159,
  },
  {
    id: "AUT",
    value: 798526,
  },
  {
    id: "AZE",
    value: 481678,
  },
  {
    id: "BDI",
    value: 496457,
  },
  {
    id: "BEL",
    value: 252276,
  },
  {
    id: "BEN",
    value: 440315,
  },
  {
    id: "BFA",
    value: 343752,
  },
  {
    id: "BGD",
    value: 920203,
  },
  {
    id: "BGR",
    value: 261196,
  },
  {
    id: "BHS",
    value: 421551,
  },
  {
    id: "BIH",
    value: 974745,
  },
  {
    id: "BLR",
    value: 349288,
  },
  {
    id: "BLZ",
    value: 305983,
  },
  {
    id: "BOL",
    value: 430840,
  },
  {
    id: "BRN",
    value: 345666,
  },
  {
    id: "BTN",
    value: 649678,
  },
  {
    id: "BWA",
    value: 319392,
  },
  {
    id: "CAF",
    value: 722549,
  },
  {
    id: "CAN",
    value: 332843,
  },
  {
    id: "CHE",
    value: 122159,
  },
  {
    id: "CHL",
    value: 811736,
  },
  {
    id: "CHN",
    value: 593604,
  },
  {
    id: "CIV",
    value: 143219,
  },
  {
    id: "CMR",
    value: 630627,
  },
  {
    id: "COG",
    value: 498556,
  },
  {
    id: "COL",
    value: 660527,
  },
  {
    id: "CRI",
    value: 60262,
  },
  {
    id: "CUB",
    value: 177870,
  },
  {
    id: "-99",
    value: 463208,
  },
  {
    id: "CYP",
    value: 945909,
  },
  {
    id: "CZE",
    value: 500109,
  },
  {
    id: "DEU",
    value: 63345,
  },
  {
    id: "DJI",
    value: 634523,
  },
  {
    id: "DNK",
    value: 731068,
  },
  {
    id: "DOM",
    value: 262538,
  },
  {
    id: "DZA",
    value: 760695,
  },
  {
    id: "ECU",
    value: 301263,
  },
  {
    id: "EGY",
    value: 148475,
  },
  {
    id: "ERI",
    value: 939504,
  },
  {
    id: "ESP",
    value: 706050,
  },
  {
    id: "EST",
    value: 977015,
  },
  {
    id: "ETH",
    value: 461734,
  },
  {
    id: "FIN",
    value: 22800,
  },
  {
    id: "FJI",
    value: 18985,
  },
  {
    id: "FLK",
    value: 64986,
  },
  {
    id: "FRA",
    value: 447457,
  },
  {
    id: "GAB",
    value: 669675,
  },
  {
    id: "GBR",
    value: 757120,
  },
  {
    id: "GEO",
    value: 158702,
  },
  {
    id: "GHA",
    value: 893180,
  },
  {
    id: "GIN",
    value: 877288,
  },
  {
    id: "GMB",
    value: 724530,
  },
  {
    id: "GNB",
    value: 387753,
  },
  {
    id: "GNQ",
    value: 706118,
  },
  {
    id: "GRC",
    value: 377796,
  },
  {
    id: "GTM",
    value: 66890,
  },
  {
    id: "GUY",
    value: 719300,
  },
  {
    id: "HND",
    value: 739590,
  },
  {
    id: "HRV",
    value: 929467,
  },
  {
    id: "HTI",
    value: 538961,
  },
  {
    id: "HUN",
    value: 146095,
  },
  {
    id: "IDN",
    value: 490681,
  },
  {
    id: "IND",
    value: 549818,
  },
  {
    id: "IRL",
    value: 630163,
  },
  {
    id: "IRN",
    value: 596921,
  },
  {
    id: "IRQ",
    value: 767023,
  },
  {
    id: "ISL",
    value: 478682,
  },
  {
    id: "ISR",
    value: 963688,
  },
  {
    id: "ITA",
    value: 393089,
  },
  {
    id: "JAM",
    value: 83173,
  },
  {
    id: "JOR",
    value: 52005,
  },
  {
    id: "JPN",
    value: 199174,
  },
  {
    id: "KAZ",
    value: 181424,
  },
  {
    id: "KEN",
    value: 60946,
  },
  {
    id: "KGZ",
    value: 432478,
  },
  {
    id: "KHM",
    value: 254461,
  },
  {
    id: "OSA",
    value: 942447,
  },
  {
    id: "KWT",
    value: 414413,
  },
  {
    id: "LAO",
    value: 448339,
  },
  {
    id: "LBN",
    value: 620090,
  },
  {
    id: "LBR",
    value: 435950,
  },
  {
    id: "LBY",
    value: 75091,
  },
  {
    id: "LKA",
    value: 595124,
  },
  {
    id: "LSO",
    value: 483524,
  },
  {
    id: "LTU",
    value: 867357,
  },
  {
    id: "LUX",
    value: 689172,
  },
  {
    id: "LVA",
    value: 742980,
  },
  {
    id: "MAR",
    value: 236538,
  },
  {
    id: "MDA",
    value: 926836,
  },
  {
    id: "MDG",
    value: 840840,
  },
  {
    id: "MEX",
    value: 353910,
  },
  {
    id: "MKD",
    value: 505842,
  },
  {
    id: "MLI",
    value: 286082,
  },
  {
    id: "MMR",
    value: 915544,
  },
  {
    id: "MNE",
    value: 609500,
  },
  {
    id: "MNG",
    value: 410428,
  },
  {
    id: "MOZ",
    value: 32868,
  },
  {
    id: "MRT",
    value: 375671,
  },
  {
    id: "MWI",
    value: 591935,
  },
  {
    id: "MYS",
    value: 991644,
  },
  {
    id: "NAM",
    value: 701897,
  },
  {
    id: "NCL",
    value: 144098,
  },
  {
    id: "NER",
    value: 312944,
  },
  {
    id: "NGA",
    value: 862877,
  },
  {
    id: "NIC",
    value: 90831,
  },
  {
    id: "NLD",
    value: 281879,
  },
  {
    id: "NOR",
    value: 224537,
  },
  {
    id: "NPL",
    value: 322331,
  },
  {
    id: "NZL",
    value: 86615,
  },
  {
    id: "OMN",
    value: 707881,
  },
  {
    id: "PAK",
    value: 158577,
  },
  {
    id: "PAN",
    value: 738579,
  },
  {
    id: "PER",
    value: 248751,
  },
  {
    id: "PHL",
    value: 557292,
  },
  {
    id: "PNG",
    value: 516874,
  },
  {
    id: "POL",
    value: 682137,
  },
  {
    id: "PRI",
    value: 957399,
  },
  {
    id: "PRT",
    value: 846430,
  },
  {
    id: "PRY",
    value: 720555,
  },
  {
    id: "QAT",
    value: 478726,
  },
  {
    id: "ROU",
    value: 259318,
  },
  {
    id: "RUS",
    value: 268735,
  },
  {
    id: "RWA",
    value: 136781,
  },
  {
    id: "ESH",
    value: 151957,
  },
  {
    id: "SAU",
    value: 111821,
  },
  {
    id: "SDN",
    value: 927112,
  },
  {
    id: "SDS",
    value: 966473,
  },
  {
    id: "SEN",
    value: 158085,
  },
  {
    id: "SLB",
    value: 178389,
  },
  {
    id: "SLE",
    value: 528433,
  },
  {
    id: "SLV",
    value: 353467,
  },
  {
    id: "ABV",
    value: 251,
  },
  {
    id: "SOM",
    value: 445243,
  },
  {
    id: "SRB",
    value: 202402,
  },
  {
    id: "SUR",
    value: 972121,
  },
  {
    id: "SVK",
    value: 319923,
  },
  {
    id: "SVN",
    value: 728766,
  },
  {
    id: "SWZ",
    value: 379669,
  },
  {
    id: "SYR",
    value: 16221,
  },
  {
    id: "TCD",
    value: 101273,
  },
  {
    id: "TGO",
    value: 498411,
  },
  {
    id: "THA",
    value: 506906,
  },
  {
    id: "TJK",
    value: 613093,
  },
  {
    id: "TKM",
    value: 327016,
  },
  {
    id: "TLS",
    value: 607972,
  },
  {
    id: "TTO",
    value: 936365,
  },
  {
    id: "TUN",
    value: 898416,
  },
  {
    id: "TUR",
    value: 237783,
  },
  {
    id: "TWN",
    value: 878213,
  },
  {
    id: "TZA",
    value: 442174,
  },
  {
    id: "UGA",
    value: 720710,
  },
  {
    id: "UKR",
    value: 74172,
  },
  {
    id: "URY",
    value: 753177,
  },
  {
    id: "USA",
    value: 658725,
  },
  {
    id: "UZB",
    value: 550313,
  },
  {
    id: "VEN",
    value: 707492,
  },
  {
    id: "VNM",
    value: 538907,
  },
  {
    id: "VUT",
    value: 650646,
  },
  {
    id: "PSE",
    value: 476078,
  },
  {
    id: "YEM",
    value: 957751,
  },
  {
    id: "ZAF",
    value: 836949,
  },
  {
    id: "ZMB",
    value: 714503,
  },
  {
    id: "ZWE",
    value: 405217,
  },
  {
    id: "KOR",
    value: 171135,
  },
];
