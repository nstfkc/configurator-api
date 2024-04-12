import { ConfigStatus } from '@Domain/enums';
import { UuidString } from '@Shared/types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LinkModel } from '@/modules/config/models/link.model';

@Entity('configurator.configs')
export class ConfigModel {
  @PrimaryGeneratedColumn('uuid', { name: 'config_id' })
  id!: string;

  @Column({ type: 'jsonb', name: 'config_payload' })
  payload!: Record<string, any>;

  @Column({ name: 'config_status', enum: ConfigStatus })
  status!: ConfigStatus;

  @Column({ name: 'config_parent_config_id', nullable: true, type: 'uuid' })
  parentId!: UuidString | null;

  @Column({ type: 'timestamptz', name: 'config_created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'config_ordered_at' })
  orderedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'config_updated_at' })
  updatedAt!: Date | null;

  @OneToMany(() => LinkModel, (x) => x.config)
  links!: LinkModel[];
}
