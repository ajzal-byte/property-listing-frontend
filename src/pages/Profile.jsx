import React, { useState, useContext } from "react";
import {
  Edit,
  Share,
  LogOut,
  Facebook,
  MessageCircle,
  Instagram,
  Send,
  User,
} from "lucide-react";

import TabContext from "./../contexts/TabContext";
import { mockUsers } from "../mockdata/mockData";

// mock user, will come from API
const userData  = mockUsers[0]

const availableLanguages = ["English", "العربية"];

const availableCurrencies = ["AED", "USD"];

const availableUnits = ["m²", "ft²"];

const availableCountries = [
  "Saudi Arabia",
  "United States",
  "United Arab Emirates",
];

const ProfilePage = () => {
  const { setMainTab } = useContext(TabContext);
  setMainTab("Hidden");
  const [settings, setSettings] = useState(userData.userSettings);
  const [userInfo, setUserInfo] = useState(userData);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [tempUserInfo, setTempUserInfo] = useState(userData);

  const handleEditProfile = () => {
    setEditProfileOpen(true);
    setTempUserInfo(userInfo);
  };

  const handleEditInfo = () => {
    setEditInfoOpen(true);
    setTempUserInfo(userInfo);
  };

  const handleSaveProfile = () => {
    setUserInfo(tempUserInfo);
    setEditProfileOpen(false);
  };

  const handleSaveInfo = () => {
    setUserInfo(tempUserInfo);
    setEditInfoOpen(false);
  };

  // QR code would typically be generated server-side or using a library
  const qrCodeImage = "/sample-qr.png";
  const handleLanguageChange = (lang) => {
    setSettings({ ...settings, language: lang });
  };

  const handleCurrencyChange = (currency) => {
    setSettings({ ...settings, currency: currency });
  };

  const handleUnitChange = (unit) => {
    setSettings({ ...settings, units: unit });
  };

  const handleCountryChange = (country) => {
    setSettings({ ...settings, behomesCountry: country });
  };

  return (
    <div className="w-full mx-auto p-8 bg-white ">
      {/* Profile Header */}
      

      <div className="text-4xl font-semibold">Profile Page</div>
      <div className="flex justify-end mb-4">
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center" onClick={handleEditProfile}>
          <Edit className="mr-2" /> Edit profile
        </button>
      
      </div>

            {/* Edit Profile Modal */}
            {
            editProfileOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96  border border-blue-800">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div>Firstname</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.firstName}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, firstName: e.target.value })
              }
            />
            <div> Lastname</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.lastName}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, lastName: e.target.value })
              }
            />

            <div> Phone</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.phone}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, phone: e.target.value })
              }
            />
            <div> Email</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.email}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, email: e.target.value })
              }
            />
            <div> Country</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.country}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, country: e.target.value })
              }
            />
            <div> Whatsapp</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.social.whatsapp}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo, social: {...tempUserInfo.social, whatsapp: e.target.value} })
              }
            />
            <div> Instagram</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.social.instagram}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo,  social: {...tempUserInfo.social, instagram: e.target.value} })
              }
            />
            <div> Telegram</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.social.telegram}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo,  social: {...tempUserInfo.social, telegram: e.target.value} })
              }
            />
            <div> Facebook</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.social.facebook}
              onChange={(e) =>
                setTempUserInfo({ ...tempUserInfo,  social: {...tempUserInfo.social, facebook: e.target.value} })
              }
            />

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300" onClick={() => setEditProfileOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-900 text-white" onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* User Info Section */}
      <div className="flex items-start gap-6 border-b pb-6 mb-6">
        {/* Avatar and QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            {/* User avatar would go here */}
            <img src="user.png" alt="user" />
          </div>
          <div className="text-xs text-gray-500">
            <div>user-{userData.userId}</div>
            <div>{userData.userIdExtraInfo}</div>
          </div>
          {/* <img src={qrCodeImage} alt="QR Code" className="w-24 h-24" /> */}
        </div>

        {/* User Details */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-1 ">
          {/* First Name */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">
                <User />
              </span>{" "}
              First name
            </div>
            <div>{userInfo.firstName}</div>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">☎</span> Phone
            </div>
            <div>{userInfo.phone}</div>
          </div>

          {/* Last Name */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">
                <User />
              </span>{" "}
              Last name
            </div>
            <div>{userInfo.lastName || "—"}</div>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">✉</span> E-mail
            </div>
            <div>{userInfo.email}</div>
          </div>

          {/* Profile Visibility */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">👁</span> Profile visibility
            </div>
            <div>{userInfo.profileVisibility}</div>
          </div>

          {/* Country */}
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <span className="mr-1">🏳</span> My country
            </div>
            <div>{userInfo.country}</div>
          </div>

          {/* Social Media */}
          <div className="col-span-2 grid grid-cols-2 gap-x-16 gap-y-4 mt-2">
            {/* WhatsApp */}
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span className="mr-1">
                  <MessageCircle />
                </span>{" "}
                Whatsapp
              </div>
              <div>{userInfo.social.whatsapp || "—"}</div>
            </div>

            {/* Instagram */}
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span className="mr-1">
                  <Instagram />
                </span>{" "}
                Instagram
              </div>
              <div>{userInfo.social.instagram || "—"}</div>
            </div>

            {/* Telegram */}
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span className="mr-1">
                  <Send />
                </span>{" "}
                Telegram
              </div>
              <div>{userInfo.social.telegram || "—"}</div>
            </div>

            {/* Facebook */}
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span className="mr-1">
                  <Facebook />
                </span>{" "}
                Facebook
              </div>
              <div>{userInfo.social.facebook || "—"}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button className="bg-orange-400 text-white px-4 py-2 rounded-md flex items-center">
            <Share className="mr-2" /> Share Profile
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center">
            <LogOut className="mr-2" /> Log Out
          </button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        {/* Language */}
        <div className="mb-4">
          <div className="text-gray-700 mb-2">Language</div>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                className={`px-4 py-2 rounded-full text-sm ${
                  settings.language === lang
                    ? "bg-blue-900 text-white"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="mb-4">
          <div className="text-gray-700 mb-2">Currency on the website</div>
          <div className="flex flex-wrap gap-2">
            {availableCurrencies.map((curr) => (
              <button
                key={curr}
                className={`px-4 py-2 rounded-full text-sm ${
                  settings.currency === curr
                    ? "bg-blue-900 text-white"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleCurrencyChange(curr)}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Units */}
        <div className="mb-4">
          <div className="text-gray-700 mb-2">Units on the website</div>
          <div className="flex flex-wrap gap-2">
            {availableUnits.map((unit) => (
              <button
                key={unit}
                className={`px-4 py-2 rounded-full text-sm ${
                  settings.units === unit
                    ? "bg-blue-900 text-white"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleUnitChange(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div className="mb-4">
          <div className="text-gray-700 mb-2">Select country</div>
          <div className="flex flex-wrap gap-2">
            {availableCountries.map((country) => (
              <button
                key={country}
                className={`px-4 py-2 rounded-full text-sm ${
                  settings.behomesCountry === country
                    ? "bg-blue-900 text-white"
                    : "border border-gray-300 text-gray-700"
                }`}
                onClick={() => handleCountryChange(country)}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Information</h2>
          <button className="border border-gray-300 text-blue-900 px-4 py-1 rounded-md flex items-center" onClick={handleEditInfo}>
            <Edit className="mr-2" /> Edit Info
          </button>
        </div>

        {/* Information Fields */}
        <div className="gap-y-24 flex justify-center">
            <div className="w-[95%]">
          <div className="flex justify-between pb-2 border-b">
            <div className="text-gray-700">Position</div>
            <div>{userInfo.position || "—"}</div>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <div className="text-gray-700">Expertise</div>
            <div>{userInfo.expertise||userData.expertise || "—"}</div>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <div className="text-gray-700">Experience</div>
            <div>{userInfo.experience||userData.experience || "—"}</div>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <div className="text-gray-700">Languages</div>
            <div>{userInfo.languages||userData.languages || "—"}</div>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <div className="text-gray-700">BRN</div>
            <div>{userInfo.brn||userData.brn || "—"}</div>
          </div>
        </div>
        </div>

        {editInfoOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96  border border-blue-800">
            <h2 className="text-xl font-semibold mb-4">Edit Information</h2>
            <div>Position</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.position || ""}
              onChange={(e) => setTempUserInfo({ ...tempUserInfo, position: e.target.value })}
            />
            <div>Expertise</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.expertise || ""}
              onChange={(e) => setTempUserInfo({ ...tempUserInfo, expertise: e.target.value })}
            />
            <div>Experience</div>
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.experience || ""}
              onChange={(e) => setTempUserInfo({ ...tempUserInfo, experience: e.target.value })}
            />
            <div>Languages</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.languages || ""}
              onChange={(e) => setTempUserInfo({ ...tempUserInfo, languages: e.target.value })}
            />
            <div>BRN</div>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={tempUserInfo.brn || ""}
              onChange={(e) => setTempUserInfo({ ...tempUserInfo, brn: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300" onClick={() => setEditInfoOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-900 text-white" onClick={handleSaveInfo}>Save</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;
