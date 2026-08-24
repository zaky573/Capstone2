import Chip from '@mui/material/Chip'
import { STATUS_COLOR, STATUS_LABEL } from '../../utils/constants'

export default function StatusBadge({ status, size = 'small' }) {
  const color = STATUS_COLOR[status] || 'default'
  return <Chip size={size} color={color} label={STATUS_LABEL[status] || status} />
}
