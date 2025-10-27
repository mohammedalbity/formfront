# Form.io Vue 3 Application with Laravel Backend Integration

تطبيق Vue 3 احترافي مع تكامل Form.io ودعم اللغة العربية وتكامل Laravel Backend

A professional Vue 3 application with Form.io integration, Arabic language support, and Laravel backend integration.

## ✨ المميزات / Features

- 🚀 **Vue 3 + Vite + TypeScript** - أحدث التقنيات للتطوير السريع
- 📋 **Form.io Integration** - تكامل كامل مع مكتبة Form.io لإنشاء النماذج
- 🔐 **Laravel Backend Integration** - تكامل كامل مع Laravel 12 Backend API
- 🛡️ **Token-based Authentication** - نظام مصادقة آمن باستخدام API tokens
- 🔑 **Bearer Token Auth** - مصادقة قائمة على الرموز المميزة مع localStorage
- 📊 **State Management** - إدارة الحالة باستخدام Pinia
- 🌍 **Multi-language Support** - دعم اللغة العربية والإنجليزية مع i18n
- 🔄 **RTL/LTR Support** - دعم اتجاه النص من اليمين إلى اليسار
- 🎨 **TailwindCSS** - تصميم حديث ومتجاوب
- 📱 **Responsive Design** - يعمل على جميع الأجهزة
- ⚡ **Fast Development** - تطوير سريع مع Hot Module Replacement
- 🔧 **ESLint + Prettier** - كود منظم ونظيف

## 🛠️ التقنيات المستخدمة / Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Forms**: Form.io
- **HTTP Client**: Axios
- **State Management**: Pinia
- **Internationalization**: Vue I18n
- **Routing**: Vue Router
- **Backend**: Laravel 12 API
- **Authentication**: Token-based (Bearer Tokens)
- **Code Quality**: ESLint + Prettier

## 📋 متطلبات النظام / System Requirements

- Node.js (v20.19.0 أو أحدث / or newer)
- npm أو yarn أو pnpm

## 🚀 التثبيت والتشغيل / Installation & Setup

### 1. تثبيت Node.js / Install Node.js

إذا لم يكن Node.js مثبتاً على نظامك، يمكنك تحميله من:
If Node.js is not installed on your system, download it from:

```bash
# تحقق من إصدار Node.js / Check Node.js version
node --version

# تحقق من إصدار npm / Check npm version
npm --version
```

**للأنظمة المختلفة / For different systems:**

- **Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- **CentOS/RHEL/Fedora:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

- **macOS:**
```bash
# باستخدام Homebrew / Using Homebrew
brew install node
```

- **Windows:**
قم بتحميل المثبت من الموقع الرسمي / Download installer from official website:
https://nodejs.org/

### 2. تثبيت التبعيات / Install Dependencies

```bash
# تثبيت جميع التبعيات / Install all dependencies
npm install

# أو باستخدام yarn / or using yarn
yarn install

# أو باستخدام pnpm / or using pnpm
pnpm install
```

### 3. إعداد متغيرات البيئة / Environment Setup

```bash
# نسخ ملف البيئة / Copy environment file
cp .env.example .env

# تحديث متغيرات Laravel Backend / Update Laravel Backend variables
VITE_API_BASE_URL=https://formend.fikra-ye.app
VITE_SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,localhost:3000,127.0.0.1:3000
```

### 4. تشغيل التطبيق / Run the Application

```bash
# تشغيل خادم التطوير / Start development server
npm run dev

# تشغيل مع Laravel Sanctum / Run with Laravel Sanctum
npm run dev:sanctum

# أو / or
yarn dev

# أو / or
pnpm dev
```

سيتم تشغيل التطبيق على: `http://localhost:5173`
The application will run on: `http://localhost:5173`

## 🔐 Laravel Sanctum Integration

تم تكامل التطبيق مع Laravel Sanctum لتوفير نظام مصادقة آمن وفعال.
The application is integrated with Laravel Sanctum for secure and efficient authentication.

### الميزات المُطبقة / Implemented Features

- ✅ **CSRF Protection** - حماية من هجمات CSRF مع تجديد تلقائي للرموز
- ✅ **Session-based Authentication** - مصادقة قائمة على الجلسات مع دعم الكوكيز
- ✅ **Automatic Token Management** - إدارة تلقائية لرموز المصادقة
- ✅ **Router Guards** - حماية المسارات مع إعادة توجيه تلقائية
- ✅ **Error Handling** - معالجة شاملة للأخطاء والاستثناءات
- ✅ **Composable Functions** - دوال قابلة للإعادة الاستخدام للمصادقة

### التوثيق التفصيلي / Detailed Documentation

للحصول على دليل شامل حول تكامل Laravel Sanctum، راجع:
For comprehensive guide on Laravel Sanctum integration, see:

📖 **[SANCTUM_INTEGRATION.md](./SANCTUM_INTEGRATION.md)**

## 📁 هيكل المشروع / Project Structure

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام / Reusable components
│   ├── FormioRenderer.vue   # مكون عرض نماذج Form.io / Form.io renderer component
│   ├── FormBuilder.vue      # مكون بناء النماذج / Form builder component
│   └── Layout.vue          # تخطيط الصفحة الرئيسي / Main layout component
├── views/              # صفحات التطبيق / Application pages
│   ├── Home.vue           # الصفحة الرئيسية / Home page
│   ├── Login.vue          # صفحة تسجيل الدخول / Login page
│   ├── FormBuilder.vue    # صفحة بناء النماذج / Form builder page
│   └── FormsManagement.vue # صفحة إدارة النماذج / Forms management page
├── stores/             # إدارة الحالة / State management
│   ├── auth.ts            # متجر المصادقة / Authentication store
│   ├── forms.ts           # متجر النماذج / Forms store
│   └── components.ts      # متجر المكونات / Components store
├── services/           # خدمات API / API services
│   └── apiClient.ts       # عميل API مع دعم Sanctum / API client with Sanctum support
├── composables/        # دوال قابلة للإعادة الاستخدام / Composable functions
│   └── useAuth.ts         # دوال المصادقة / Authentication composables
├── middleware/         # وسطاء الحماية / Security middleware
│   └── csrf.ts            # حماية CSRF / CSRF protection
├── utils/              # أدوات مساعدة / Utility functions
│   └── axios.ts           # إعداد HTTP client / HTTP client setup
├── i18n/               # إعدادات الترجمة / Internationalization
│   └── index.ts           # إعداد vue-i18n / vue-i18n configuration
├── locales/            # ملفات الترجمة / Translation files
│   ├── ar.json            # الترجمة العربية / Arabic translations
│   └── en.json            # الترجمة الإنجليزية / English translations
├── router/             # إعدادات التوجيه / Router configuration
│   └── index.ts           # Vue Router setup with guards
├── style.css           # الأنماط العامة / Global styles
└── main.ts             # نقطة دخول التطبيق / Application entry point
```

## 🎯 الاستخدام / Usage

### استخدام مكون FormioRenderer / Using FormioRenderer Component

```vue
<template>
  <FormioRenderer
    :form-json="formSchema"
    :language="currentLanguage"
    :options="formOptions"
    @submit="handleSubmit"
    @change="handleChange"
    @error="handleError"
  />
</template>

<script setup>
import FormioRenderer from '@/components/FormioRenderer.vue'

const formSchema = {
  components: [
    {
      type: 'textfield',
      key: 'name',
      label: 'الاسم / Name',
      validate: { required: true }
    }
  ]
}

const handleSubmit = (submission) => {
  console.log('Form submitted:', submission)
}
</script>
```

### تغيير اللغة / Language Switching

```javascript
import { changeLanguage } from '@/i18n'

// تغيير إلى العربية / Switch to Arabic
changeLanguage('ar')

// تغيير إلى الإنجليزية / Switch to English
changeLanguage('en')
```

## 🔧 أوامر البناء / Build Commands

```bash
# فحص الأنواع / Type checking
npm run type-check

# بناء للإنتاج / Build for production
npm run build

# معاينة البناء / Preview build
npm run preview

# فحص الكود / Lint code
npm run lint

# تنسيق الكود / Format code
npm run format
```

## 📚 التوثيق / Documentation

### FormioRenderer Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `formUrl` | String | '' | رابط النموذج من Form.io / Form.io form URL |
| `formJson` | Object | undefined | مخطط النموذج JSON / JSON form schema |
| `language` | String | 'ar' | لغة النموذج / Form language |
| `options` | Object | {} | خيارات إضافية لـ Form.io / Additional Form.io options |

### FormioRenderer Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | submission | يتم إطلاقه عند إرسال النموذج / Fired when form is submitted |
| `change` | changed | يتم إطلاقه عند تغيير البيانات / Fired when form data changes |
| `error` | error | يتم إطلاقه عند حدوث خطأ / Fired when an error occurs |
| `ready` | form | يتم إطلاقه عند جاهزية النموذج / Fired when form is ready |

## 🎨 التخصيص / Customization

### إضافة ترجمات جديدة / Adding New Translations

1. أضف الترجمات في `src/locales/ar.json` و `src/locales/en.json`
2. استخدم `$t('key')` في المكونات
3. استخدم `t('key')` في JavaScript

```json
// src/locales/ar.json
{
  "welcome": "مرحباً بك",
  "button": {
    "save": "حفظ",
    "cancel": "إلغاء"
  }
}
```

### تخصيص الأنماط / Customizing Styles

يمكنك تخصيص الأنماط عبر تعديل `tailwind.config.js`:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color'
      }
    }
  }
}
```

## 🐛 استكشاف الأخطاء / Troubleshooting

### مشاكل شائعة / Common Issues

1. **خطأ في تثبيت التبعيات / Dependencies installation error:**
   ```bash
   # امسح node_modules وأعد التثبيت / Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **مشاكل في TypeScript / TypeScript issues:**
   ```bash
   # فحص الأنواع / Check types
   npm run type-check
   ```

3. **مشاكل في Form.io / Form.io issues:**
   - تأكد من صحة مخطط JSON / Ensure JSON schema is valid
   - تحقق من إعدادات الشبكة / Check network settings

## 🤝 المساهمة / Contributing

1. Fork المشروع / Fork the project
2. أنشئ فرع للميزة الجديدة / Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات / Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push للفرع / Push to branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request / Open Pull Request

## 📄 الترخيص / License

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 الدعم / Support

إذا واجهت أي مشاكل أو لديك أسئلة:
If you encounter any issues or have questions:

- افتح issue في GitHub / Open an issue on GitHub
- راجع التوثيق / Check the documentation
- تواصل مع فريق التطوير / Contact the development team

## 🙏 شكر وتقدير / Acknowledgments

- [Vue.js](https://vuejs.org/) - إطار العمل الأساسي / Core framework
- [Form.io](https://form.io/) - مكتبة النماذج / Forms library
- [TailwindCSS](https://tailwindcss.com/) - إطار عمل CSS / CSS framework
- [Vue I18n](https://vue-i18n.intlify.dev/) - مكتبة الترجمة / Internationalization library

---

**صُنع بـ ❤️ للمجتمع العربي / Made with ❤️ for the Arabic community**
#   f o r m f r o n t  
 