import { useState } from "react";
import { Plus, Trash2, Edit2, Check, Sprout, Leaf, Droplets, Sun, Thermometer, Save, X } from "lucide-react";

interface ParameterValues {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  sunlight: number;
}

interface Preset extends ParameterValues {
  id: string;
  name: string;
  description: string;
}

interface CropPresetsPageProps {
  darkMode: boolean;
  onApplyPreset: (values: ParameterValues) => void;
  apiUrl?: string; // Optional: For future expansion to save presets to MongoDB
}

export function CropPresetsPage({ darkMode, onApplyPreset, apiUrl }: CropPresetsPageProps) {
  // Local state for presets - could be moved to MongoDB later
  const [presets, setPresets] = useState<Preset[]>([
    {
      id: "1",
      name: "Tomatoes (Vegetative)",
      description: "Optimal conditions for tomato vegetative growth stage",
      temperature: 24,
      humidity: 65,
      soilMoisture: 70,
      sunlight: 80,
    },
    {
      id: "2",
      name: "Lettuce / Leafy Greens",
      description: "Cooler, moist conditions for rapid leaf development",
      temperature: 18,
      humidity: 70,
      soilMoisture: 60,
      sunlight: 50,
    },
    {
      id: "3",
      name: "Cannabis (Flowering)",
      description: "Lower humidity and high light for flowering stage",
      temperature: 26,
      humidity: 45,
      soilMoisture: 50,
      sunlight: 100,
    },
    {
      id: "4",
      name: "Orchids (Tropical)",
      description: "Warm, humid conditions with filtered light",
      temperature: 28,
      humidity: 80,
      soilMoisture: 40,
      sunlight: 30,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null); // Track which preset is being synced
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Preset, "id">>({
    name: "",
    description: "",
    temperature: 25,
    humidity: 60,
    soilMoisture: 50,
    sunlight: 50,
  });

  const handleApply = (preset: Preset) => {
    setApplyingId(preset.id);
    
    // Trigger the backend sync via the prop defined in Dashboard.tsx
    onApplyPreset({
      temperature: preset.temperature,
      humidity: preset.humidity,
      soilMoisture: preset.soilMoisture,
      sunlight: preset.sunlight,
    });

    // Reset the loading state after a brief delay for visual feedback
    setTimeout(() => setApplyingId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
  };

  const handleEdit = (preset: Preset) => {
    setEditingId(preset.id);
    setFormData({
      name: preset.name,
      description: preset.description,
      temperature: preset.temperature,
      humidity: preset.humidity,
      soilMoisture: preset.soilMoisture,
      sunlight: preset.sunlight,
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setPresets(
        presets.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p
        )
      );
    } else {
      setPresets([
        ...presets,
        { ...formData, id: Math.random().toString(36).substr(2, 9) },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      temperature: 25,
      humidity: 60,
      soilMoisture: 50,
      sunlight: 50,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Crop Presets Library
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Apply pre-configured environmental settings directly to your greenhouse system
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Crop
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? "Edit Plant Requirements" : "Define New Crop Requirements"}
            </h3>
            <button onClick={resetForm} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Plant Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Basil Seedlings"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description / Growth Stage
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                  placeholder="Note stage (e.g., Early flowering, seedling phase)..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" /> Target Temp (°C)
                </label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> Target Humidity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-2">
                  <Sprout className="w-4 h-4" /> Min Soil Moisture (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.soilMoisture}
                  onChange={(e) => setFormData({ ...formData, soilMoisture: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1 flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Required Sunlight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sunlight}
                  onChange={(e) => setFormData({ ...formData, sunlight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save to Library
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {preset.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(preset)}
                  className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  aria-label="Edit preset"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(preset.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label="Delete preset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{preset.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{preset.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-green-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{preset.soilMoisture}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{preset.sunlight}%</span>
              </div>
            </div>

            <button
              onClick={() => handleApply(preset)}
              disabled={applyingId !== null}
              className={`w-full py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold ${
                applyingId === preset.id
                  ? 'bg-green-500 text-white cursor-wait'
                  : 'bg-slate-50 dark:bg-slate-700 hover:bg-orange-500 dark:hover:bg-orange-600 text-slate-700 dark:text-slate-200 hover:text-white'
              }`}
            >
              {applyingId === preset.id ? (
                <>
                  <Save className="w-4 h-4 animate-bounce" />
                  Syncing to ESP32...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Requirements
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
