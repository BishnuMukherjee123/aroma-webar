-- Update the configuration for the 'aroma-assets' bucket
-- This sets a strict file size limit and restricts uploads to only images and 3D models

UPDATE storage.buckets
SET 
  -- Restrict file size to 20MB (20 * 1024 * 1024 bytes)
  file_size_limit = 20971520,
  
  -- Restrict allowed file types to Images and 3D Models
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'model/gltf-binary', -- .glb
    'model/gltf+json'    -- .gltf
  ]
WHERE id = 'aroma-assets';
