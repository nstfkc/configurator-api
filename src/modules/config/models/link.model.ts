import { UuidString } from '@Shared/types';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConfigModel } from '@/modules/config/models/config.model';

@Entity('configurator.links')
export class LinkModel {
  @PrimaryGeneratedColumn('uuid', { name: 'link_id' })
  id!: string;

  @Column({ name: 'config_id', type: 'uuid' })
  configId!: UuidString;

  @Column({ type: 'timestamptz', name: 'link_created_at' })
  createdAt!: Date;

  @OneToOne(() => ConfigModel, (x: ConfigModel) => x.links)
  config!: ConfigModel;
}
