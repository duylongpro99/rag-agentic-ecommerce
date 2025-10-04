# Task 05: Create SpecExtractorTool

## Description
Build a tool that extracts and normalizes product specifications from unstructured text.

## File Location
`agentic/tools/spec_extractor.py` (new file)

## Implementation Checklist

- [ ] Create `spec_extractor.py`
- [ ] Define spec schemas for product categories
- [ ] Implement LLM-based spec extraction
- [ ] Add spec normalization
- [ ] Handle missing specs
- [ ] Test with various product types

## Implementation
```python
# agentic/tools/spec_extractor.py

from typing import Dict, List, Any
import json
import re
from agentic.factory.llm_model import LLMModel

class SpecExtractorTool:
    """Extract and normalize product specifications"""

    # Spec schemas for different categories
    SPEC_SCHEMAS = {
        "laptop": {
            "cpu": {"type": "string", "examples": ["Intel i7", "AMD Ryzen 5"]},
            "gpu": {"type": "string", "examples": ["NVIDIA RTX 3060", "Integrated"]},
            "ram": {"type": "string", "examples": ["16GB", "32GB DDR4"]},
            "storage": {"type": "string", "examples": ["512GB SSD", "1TB NVMe"]},
            "screen_size": {"type": "string", "examples": ["15.6 inch", "14 inch"]},
            "weight": {"type": "string", "examples": ["1.5kg", "3.2 lbs"]},
            "battery_life": {"type": "string", "examples": ["10 hours", "8hr"]}
        },
        "smartphone": {
            "cpu": {"type": "string", "examples": ["A17 Pro", "Snapdragon 8 Gen 2"]},
            "ram": {"type": "string", "examples": ["8GB", "12GB"]},
            "storage": {"type": "string", "examples": ["128GB", "256GB", "512GB"]},
            "screen_size": {"type": "string", "examples": ["6.1 inch", "6.7 inch"]},
            "camera_mp": {"type": "string", "examples": ["12MP", "48MP main"]},
            "battery_mah": {"type": "string", "examples": ["4500mAh", "5000mAh"]},
            "5g": {"type": "boolean", "examples": [True, False]}
        },
        "headphones": {
            "driver_size": {"type": "string", "examples": ["40mm", "50mm"]},
            "frequency_range": {"type": "string", "examples": ["20Hz-20kHz"]},
            "impedance": {"type": "string", "examples": ["32 Ohm", "64 Ohm"]},
            "battery_life": {"type": "string", "examples": ["30 hours", "20hr"]},
            "anc": {"type": "boolean", "examples": [True, False]},
            "wireless": {"type": "boolean", "examples": [True, False]}
        },
        "monitor": {
            "screen_size": {"type": "string", "examples": ["27 inch", "32 inch"]},
            "resolution": {"type": "string", "examples": ["1920x1080", "2560x1440", "4K"]},
            "refresh_rate": {"type": "string", "examples": ["60Hz", "144Hz", "240Hz"]},
            "panel_type": {"type": "string", "examples": ["IPS", "VA", "TN"]},
            "response_time": {"type": "string", "examples": ["1ms", "5ms"]},
            "hdr": {"type": "boolean", "examples": [True, False]}
        }
    }

    def __init__(self):
        self.llm = LLMModel.get_model()

    def extract_specs(self, product: Dict, category: str = None) -> Dict[str, Any]:
        """
        Extract structured specs from product description.

        Args:
            product: Product dict with name, description, etc.
            category: Product category (laptop, smartphone, etc.)

        Returns:
            Dict of extracted specs
        """

        # Auto-detect category if not provided
        if not category:
            category = self._detect_category(product.get("category", ""))

        # Get schema for this category
        schema = self.SPEC_SCHEMAS.get(category.lower())

        if not schema:
            return {"error": f"No schema for category: {category}"}

        # Extract specs using LLM
        specs = self._llm_extract_specs(product, schema)

        # Normalize values
        specs = self._normalize_specs(specs, schema)

        return specs

    def _detect_category(self, product_category: str) -> str:
        """Map product category to spec schema"""

        category_mapping = {
            "laptop": ["laptop", "notebook", "ultrabook"],
            "smartphone": ["smartphone", "phone", "mobile"],
            "headphones": ["headphones", "earbuds", "earphones"],
            "monitor": ["monitor", "display", "screen"]
        }

        product_category_lower = product_category.lower()

        for schema_cat, keywords in category_mapping.items():
            if any(kw in product_category_lower for kw in keywords):
                return schema_cat

        return "general"

    def _llm_extract_specs(self, product: Dict, schema: Dict) -> Dict[str, Any]:
        """Use LLM to extract specs from product text"""

        spec_names = list(schema.keys())
        product_text = f"{product.get('name', '')} {product.get('description', '')}"

        prompt = f"""
Extract technical specifications from this product:

Product: {product.get('name', 'N/A')}
Description: {product.get('description', 'N/A')}

Extract these specifications:
{json.dumps(schema, indent=2)}

Return JSON with extracted values (use null if not mentioned):
{{
  {', '.join(f'"{spec}": "value or null"' for spec in spec_names)}
}}

Examples:
- "Intel Core i7-12700H" → {{"cpu": "Intel i7-12700H"}}
- "16GB DDR4 RAM" → {{"ram": "16GB"}}
- "Noise cancelling" → {{"anc": true}}

Return ONLY valid JSON. Use null for specs not mentioned in the description.
"""

        try:
            response = self.llm.invoke(prompt)

            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                specs = json.loads(json_match.group(0))
                return specs

        except Exception as e:
            print(f"Spec extraction error: {e}")

        # Return empty specs
        return {spec: None for spec in spec_names}

    def _normalize_specs(self, specs: Dict, schema: Dict) -> Dict[str, Any]:
        """Normalize spec values to consistent formats"""

        normalized = {}

        for spec_name, value in specs.items():
            if value is None or value == "null":
                normalized[spec_name] = None
                continue

            spec_type = schema.get(spec_name, {}).get("type", "string")

            if spec_type == "boolean":
                # Normalize to boolean
                if isinstance(value, bool):
                    normalized[spec_name] = value
                elif isinstance(value, str):
                    normalized[spec_name] = value.lower() in ["true", "yes", "1"]
            else:
                # Keep as string but clean up
                normalized[spec_name] = str(value).strip()

        return normalized

    def compare_specs(self, products_with_specs: List[Dict]) -> Dict[str, Any]:
        """Compare specs across multiple products"""

        if not products_with_specs:
            return {}

        # Get all spec keys
        all_specs = set()
        for product in products_with_specs:
            all_specs.update(product.get("specs", {}).keys())

        comparison = {
            "spec_comparison": {},
            "best_in_category": {}
        }

        for spec in all_specs:
            values = {}
            for product in products_with_specs:
                value = product.get("specs", {}).get(spec)
                if value:
                    values[product["name"]] = value

            comparison["spec_comparison"][spec] = values

        return comparison
```

## Testing
```python
# Test spec extraction
if __name__ == "__main__":
    extractor = SpecExtractorTool()

    laptop = {
        "name": "Dell XPS 15",
        "description": "Intel Core i7-12700H, NVIDIA RTX 3050 Ti, 16GB DDR5 RAM, 512GB NVMe SSD, 15.6-inch 4K display, weighs 2.0kg",
        "category": "Laptop"
    }

    specs = extractor.extract_specs(laptop, category="laptop")
    print(json.dumps(specs, indent=2))

    # Expected output:
    # {
    #   "cpu": "Intel i7-12700H",
    #   "gpu": "NVIDIA RTX 3050 Ti",
    #   "ram": "16GB",
    #   "storage": "512GB SSD",
    #   "screen_size": "15.6 inch",
    #   "weight": "2.0kg",
    #   "battery_life": null
    # }
```

## Expected Outcome
Accurate spec extraction from product descriptions.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
