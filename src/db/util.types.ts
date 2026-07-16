export type WranglerD1Database = {
  binding?: string;
  database_id?: string;
  database_name?: string;
  migrations_dir?: string;
  preview_database_id?: string;
};

export type WranglerConfig = {
  env?: Record<
    string,
    {
      d1_databases?: WranglerD1Database[];
    }
  >;
};

export type WranglerD1DatabaseLookup = {
  configPath?: string;
  databaseId: string;
  env: string;
};
