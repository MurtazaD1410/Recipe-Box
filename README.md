# Recipe Box
A modern recipe management application built with Laravel 12 and React. Organize your favorite recipes, create meal plans, and discover new culinary inspirations — featuring user-friendly recipe cards, categories, and search functionality.

## ✨ Features
* **Recipe Management**: Create, edit, and delete your favorite recipes.
* **Recipe Cards**: Beautiful, organized display of ingredients and instructions.
* **Categories & Tags**: Organize recipes by meal type, cuisine, or dietary preferences.
* **Search & Filter**: Quickly find recipes by name, ingredients, or tags.
* **Favorites**: Mark and save your most-loved recipes.
* **Recipe Sharing**: Share recipes with family and friends.
* **Photo Upload**: Add appetizing images to your recipes.
* **Cooking Timer**: Built-in timer for recipe steps.
* **Serving Calculator**: Adjust ingredient quantities based on servings.
* **User Authentication**: Secure personal recipe collections.
* **Responsive Design**: Works seamlessly on desktop, tablet, and mobile.

## 🚀 Tech Stack
* **Backend**: Laravel 12
* **Frontend**: React 18
* **Language**: PHP 8.2+, JavaScript/TypeScript
* **Database**: MySQL / PostgreSQL
* **Authentication**: Laravel Breeze with React
* **Styling**: Tailwind CSS
* **API**: Laravel API Resources
* **Build Tool**: Vite
* **State Management**: React Context

## 📦 Installation
### Prerequisites
* PHP 8.2 or higher
* Composer
* Node.js 18+ & npm
* MySQL or PostgreSQL
* Redis (optional, for caching)

### Setup
1. **Clone the repository**
```bash
git clone https://github.com/MurtazaD1410/Recipe-Box.git
cd Recipe-Box
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node dependencies**
```bash
npm install
```

4. **Environment configuration**
Copy the example environment file and update it with your keys:
```bash
cp .env.example .env
```
Then open `.env` and update the values. Example:
```env
APP_NAME="Recipe Box"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recipe_box
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null

# AWS S3 (Optional for image storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Redis (Optional for caching)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Run database migrations**
```bash
php artisan migrate
```

7. **Seed the database** (optional)
```bash
php artisan db:seed
```

8. **Create storage symlink**
```bash
php artisan storage:link
```

9. **Build frontend assets**
```bash
npm run build
# or for development with hot reload
npm run dev
```

10. **Start the development server**
```bash
php artisan serve
```

11. **Open your browser**
```text
http://localhost:8000
```

⭐ If you found this project helpful, please give it a star on GitHub!
