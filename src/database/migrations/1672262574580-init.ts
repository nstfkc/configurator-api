import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1672262574580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create schema configurator;`);
    await queryRunner.query(`
      create table configurator.configs
      (
        config_id               uuid                      not null
          constraint configs_pk primary key,
        config_payload          jsonb                     not null,
        config_status           varchar                   not null,
        config_created_at       timestamptz default now() not null,
        config_updated_at       timestamptz default null,
        config_ordered_at       timestamptz default null,
        config_parent_config_id uuid        default null
      );

      alter table configurator.configs
        add constraint configs_config_parent_config_id_fk
          foreign key (config_id) references configurator.configs (config_id);

      create table configurator.links
      (
        link_id         uuid                      not null
          constraint links_pk primary key,
        config_id       uuid                      not null,
        link_created_at timestamptz default now() not null
      );

      alter table configurator.links
        add constraint links_config_id_fk
          foreign key (config_id) references configurator.configs (config_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop schema configurator cascade;');
  }
}
