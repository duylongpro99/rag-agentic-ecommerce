-- Step 1: Add new UUID columns
ALTER TABLE "conversations" ADD COLUMN "uuid_id" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "messages" ADD COLUMN "uuid_id" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "messages" ADD COLUMN "conversation_uuid_id" UUID;

-- Step 2: Create a temporary table to store the mapping between old and new IDs
CREATE TEMP TABLE conversation_id_mapping (
  old_id INT,
  new_id UUID
);

-- Step 3: Populate the mapping table
INSERT INTO conversation_id_mapping (old_id, new_id)
SELECT id, uuid_id FROM "conversations";

-- Step 4: Update the conversation_uuid_id in messages
UPDATE "messages" m
SET conversation_uuid_id = c.new_id
FROM conversation_id_mapping c
WHERE m.conversation_id = c.old_id;

-- Step 5: Drop foreign key constraints
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- Step 6: Drop primary key constraints
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_pkey";
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey";

-- Step 7: Rename columns and set as primary keys
ALTER TABLE "conversations" DROP COLUMN "id";
ALTER TABLE "conversations" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

ALTER TABLE "messages" DROP COLUMN "id";
ALTER TABLE "messages" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE "messages" DROP COLUMN "conversation_id";
ALTER TABLE "messages" RENAME COLUMN "conversation_uuid_id" TO "conversation_id";

-- Step 8: Add foreign key constraint back
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" 
  FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 9: Drop the temporary mapping table
DROP TABLE conversation_id_mapping;