import os

TARGET_FILE = r"C:\Users\habee\frontend\src\pages\DashboardPage.tsx"

with open(TARGET_FILE, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add 'search' to categories
old_categories = '''  const categories = [
    { id: 'all', label: 'Overview & Analytics', icon: Layers },
    { id: 'geo', label: 'Geo-Hydro Explorer', icon: Globe },'''

new_categories = '''  const categories = [
    { id: 'all', label: 'Overview & Analytics', icon: Layers },
    { id: 'search', label: 'All-India Excel Search (970k Records)', icon: Search },
    { id: 'geo', label: 'Geo-Hydro Explorer', icon: Globe },'''

if old_categories in code:
    code = code.replace(old_categories, new_categories)

# 2. Add AllIndiaRainfallExplorer to the bottom of the 'all' tab AND in a dedicated 'search' tab
search_tab_snippet = '''      {/* Tab Content: Dedicated All-India Excel Search */}
      {activeCategory === 'search' && (
        <div className="space-y-6">
          <AllIndiaRainfallExplorer />
        </div>
      )}
'''

if "{activeCategory === 'search'" not in code:
    code = code.replace(
        "{/* Tab Content 2: Geo-Hydro Explorer */}",
        search_tab_snippet + "\n      {/* Tab Content 2: Geo-Hydro Explorer */}"
    )

# Also include AllIndiaRainfallExplorer at the bottom of the 'all' tab
old_all_end = '''              />
            </div>
          </div>
        </div>
      )}'''

new_all_end = '''              />
            </div>
          </div>

          {/* Embedded Real 970k Dataset Search Engine */}
          <div className="mt-8">
            <AllIndiaRainfallExplorer />
          </div>
        </div>
      )}'''

if old_all_end in code:
    code = code.replace(old_all_end, new_all_end)

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated DashboardPage.tsx successfully!")
