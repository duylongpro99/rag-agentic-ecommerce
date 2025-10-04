# Task 06: Define Comprehensive Spec Schemas

## Description
Expand and refine spec schemas for all major product categories with validation rules.

## File Location
`agentic/tools/spec_extractor.py`

## Implementation Checklist

- [ ] Add more product categories
- [ ] Define comprehensive specs for each
- [ ] Add validation rules
- [ ] Add unit normalization
- [ ] Add spec importance weights (for comparisons)
- [ ] Document each spec field

## Enhanced Schemas
```python
SPEC_SCHEMAS = {
    "laptop": {
        "cpu": {
            "type": "string",
            "required": True,
            "importance": 0.9,
            "description": "Processor model and generation"
        },
        "gpu": {
            "type": "string",
            "required": False,
            "importance": 0.8,
            "description": "Graphics card (integrated or dedicated)"
        },
        "ram": {
            "type": "string",
            "required": True,
            "importance": 0.85,
            "normalize": "gb",  # Convert to GB
            "description": "Memory capacity and type"
        },
        "storage": {
            "type": "string",
            "required": True,
            "importance": 0.75,
            "normalize": "gb",
            "description": "Storage capacity and type (SSD/HDD)"
        },
        "screen_size": {
            "type": "string",
            "required": True,
            "importance": 0.6,
            "normalize": "inches",
            "description": "Display diagonal size"
        },
        "resolution": {
            "type": "string",
            "required": False,
            "importance": 0.65,
            "description": "Screen resolution (e.g., 1920x1080, 4K)"
        },
        "weight": {
            "type": "string",
            "required": False,
            "importance": 0.5,
            "normalize": "kg",
            "description": "Device weight"
        },
        "battery_life": {
            "type": "string",
            "required": False,
            "importance": 0.7,
            "normalize": "hours",
            "description": "Rated battery runtime"
        },
        "ports": {
            "type": "array",
            "required": False,
            "importance": 0.4,
            "description": "Available ports (USB-C, HDMI, etc.)"
        }
    },

    "smartphone": {
        "cpu": {
            "type": "string",
            "required": True,
            "importance": 0.85,
            "description": "Chipset/Processor"
        },
        "ram": {
            "type": "string",
            "required": True,
            "importance": 0.7,
            "normalize": "gb"
        },
        "storage": {
            "type": "string",
            "required": True,
            "importance": 0.75,
            "normalize": "gb"
        },
        "screen_size": {
            "type": "string",
            "required": True,
            "importance": 0.6,
            "normalize": "inches"
        },
        "camera_mp": {
            "type": "string",
            "required": False,
            "importance": 0.8,
            "description": "Main camera megapixels"
        },
        "battery_mah": {
            "type": "string",
            "required": False,
            "importance": 0.75,
            "normalize": "mah"
        },
        "5g": {
            "type": "boolean",
            "required": False,
            "importance": 0.65
        },
        "waterproof": {
            "type": "string",
            "required": False,
            "importance": 0.5,
            "description": "IP rating (e.g., IP68)"
        },
        "display_type": {
            "type": "string",
            "required": False,
            "importance": 0.55,
            "description": "OLED, LCD, AMOLED, etc."
        }
    },

    "headphones": {
        "type": {
            "type": "string",
            "required": True,
            "importance": 0.7,
            "options": ["over-ear", "on-ear", "in-ear", "earbuds"]
        },
        "wireless": {
            "type": "boolean",
            "required": True,
            "importance": 0.8
        },
        "anc": {
            "type": "boolean",
            "required": False,
            "importance": 0.85,
            "description": "Active Noise Cancellation"
        },
        "battery_life": {
            "type": "string",
            "required": False,
            "importance": 0.75,
            "normalize": "hours"
        },
        "driver_size": {
            "type": "string",
            "required": False,
            "importance": 0.5,
            "normalize": "mm"
        },
        "impedance": {
            "type": "string",
            "required": False,
            "importance": 0.4,
            "description": "For audiophiles"
        },
        "waterproof": {
            "type": "string",
            "required": False,
            "importance": 0.6,
            "description": "IPX rating"
        }
    },

    "monitor": {
        "screen_size": {
            "type": "string",
            "required": True,
            "importance": 0.75,
            "normalize": "inches"
        },
        "resolution": {
            "type": "string",
            "required": True,
            "importance": 0.9,
            "options": ["1920x1080", "2560x1440", "3840x2160"]
        },
        "refresh_rate": {
            "type": "string",
            "required": True,
            "importance": 0.85,
            "normalize": "hz"
        },
        "panel_type": {
            "type": "string",
            "required": True,
            "importance": 0.7,
            "options": ["IPS", "VA", "TN", "OLED"]
        },
        "response_time": {
            "type": "string",
            "required": False,
            "importance": 0.75,
            "normalize": "ms"
        },
        "hdr": {
            "type": "boolean",
            "required": False,
            "importance": 0.65
        },
        "curved": {
            "type": "boolean",
            "required": False,
            "importance": 0.4
        }
    },

    "tv": {
        "screen_size": {
            "type": "string",
            "required": True,
            "importance": 0.9,
            "normalize": "inches"
        },
        "resolution": {
            "type": "string",
            "required": True,
            "importance": 0.85,
            "options": ["HD", "Full HD", "4K", "8K"]
        },
        "display_type": {
            "type": "string",
            "required": True,
            "importance": 0.8,
            "options": ["LED", "OLED", "QLED", "Mini-LED"]
        },
        "smart_tv": {
            "type": "boolean",
            "required": False,
            "importance": 0.7
        },
        "refresh_rate": {
            "type": "string",
            "required": False,
            "importance": 0.65,
            "normalize": "hz"
        },
        "hdr": {
            "type": "boolean",
            "required": False,
            "importance": 0.75
        }
    },

    "camera": {
        "megapixels": {
            "type": "string",
            "required": True,
            "importance": 0.75,
            "normalize": "mp"
        },
        "sensor_size": {
            "type": "string",
            "required": False,
            "importance": 0.85,
            "options": ["Full Frame", "APS-C", "Micro Four Thirds"]
        },
        "lens_mount": {
            "type": "string",
            "required": False,
            "importance": 0.6
        },
        "video_resolution": {
            "type": "string",
            "required": False,
            "importance": 0.7,
            "options": ["1080p", "4K", "6K", "8K"]
        },
        "autofocus_points": {
            "type": "string",
            "required": False,
            "importance": 0.65
        },
        "iso_range": {
            "type": "string",
            "required": False,
            "importance": 0.6
        }
    }
}
```

## Normalization Functions
```python
def normalize_value(self, value: str, normalize_to: str) -> float:
    """Normalize spec values to standard units"""

    if not value:
        return None

    value_lower = value.lower().replace(" ", "")

    if normalize_to == "gb":
        # Convert to GB
        if "tb" in value_lower:
            num = float(re.search(r'(\d+(?:\.\d+)?)', value).group(1))
            return num * 1024
        elif "gb" in value_lower:
            return float(re.search(r'(\d+(?:\.\d+)?)', value).group(1))

    elif normalize_to == "kg":
        # Convert to kg
        if "lbs" in value_lower or "lb" in value_lower:
            num = float(re.search(r'(\d+(?:\.\d+)?)', value).group(1))
            return num * 0.453592
        elif "kg" in value_lower:
            return float(re.search(r'(\d+(?:\.\d+)?)', value).group(1))

    elif normalize_to == "hours":
        # Extract hours
        match = re.search(r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)', value_lower)
        if match:
            return float(match.group(1))

    elif normalize_to == "inches":
        # Extract inches
        match = re.search(r'(\d+(?:\.\d+)?)\s*(?:inch|in|")', value_lower)
        if match:
            return float(match.group(1))

    return value  # Return as-is if can't normalize
```

## Expected Outcome
Comprehensive, validated spec schemas for major product categories.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
